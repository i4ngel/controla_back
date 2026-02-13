const userRepository = require("../repositories/auth.repository");
const passwordUtil = require("../utils/password.util");
const jwtUtil = require("../utils/jwt.util");
const emailUtil = require("../utils/email.util");

const { UserStatus, UserRoles } = require("../models/user.model");

class AuthService {
  async register(userData) {
    const emailExists = await userRepository.emailExists(userData.email);
    if (emailExists) {
      throw new Error("El email ya está registrado");
    }

    const usernameExists = await userRepository.usernameExists(
      userData.usuario
    );
    if (usernameExists) {
      throw new Error("El nombre de usuario ya está en uso");
    }

    const passwordValidation = passwordUtil.validateStrength(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(", "));
    }

    const hashedPassword = await passwordUtil.hash(userData.password);

    const newUserData = {
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      password: hashedPassword,
      usuario: userData.usuario,
      estado: UserStatus.ACTIVE,
      perfil: UserRoles.USER,
    };

    const user = await userRepository.create(newUserData);

    return {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      usuario: user.usuario,
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Credenciales incorrectas");
    }

    if (!user.isActive()) {
      throw new Error("Usuario inactivo o suspendido");
    }

    const isPasswordValid = await passwordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Credenciales incorrectas");
    }

    const { accessToken, refreshToken } = jwtUtil.generateTokens(user.id);

    await userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      /*user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        usuario: user.usuario,
        email: user.email,
        perfil: user.perfil,
      },*/
    };
  }

  async refreshAccessToken(refreshToken) {
    let decoded;
    try {
      decoded = await jwtUtil.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new Error("Refresh token inválido o expirado");
    }

    const user = await userRepository.findByRefreshToken(refreshToken);
    if (!user) {
      throw new Error("Refresh token no válido");
    }

    if (!user.isActive()) {
      throw new Error("Usuario inactivo");
    }

    const newAccessToken = jwtUtil.generateAccessToken(user.id);

    return {
      accessToken: newAccessToken,
    };
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user.toPublicJSON();
  }

  async logout(refreshToken) {
    const user = await userRepository.findByRefreshToken(refreshToken);
    if (!user) {
      throw new Error("Token no encontrado o ya invalidado");
    }

    await userRepository.removeRefreshToken(user.id);

    return {
      message: "Sesión cerrada correctamente",
    };
  }

  async sendRecovery(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("El correo no está registrado");
    }

    const token = jwtUtil.generateRecoveryToken(user.id);

    await emailUtil.sendRecoveryEmail(user.email, token);

    return {
      message: "Correo de recuperación enviado",
    };
  }

  async validateToken(token) {
    try {
      await jwtUtil.verifyRecoveryToken(token);
  
      return {
        valid: true,
      };
    } catch (error) {
      return {
        valid: false,
        message: "Token inválido o expirado",
      };
    }
  }  

  async resetPassword(token, newPassword) {
    let decoded;
  
    try {
      decoded = await jwtUtil.verifyRecoveryToken(token);
    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
  
    const passwordValidation = passwordUtil.validateStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(", "));
    }
  
    const hashedPassword = await passwordUtil.hash(newPassword);
  
    await userRepository.updatePassword(user.id, hashedPassword);
  
    await userRepository.removeAllRefreshTokens(user.id);
  
    return {
      message: "Contraseña actualizada correctamente",
    };
  }
  
}

module.exports = new AuthService();
