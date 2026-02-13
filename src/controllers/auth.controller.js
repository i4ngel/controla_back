const authService = require("../services/auth.service");

class AuthController {
  async register(req, res) {
    try {
      const { nombre, apellido, email, password, usuario } = req.body;

      const result = await authService.register({
        nombre,
        apellido,
        email,
        password,
        usuario,
      });

      res.status(201).json({
        success: true,
        message: "Usuario creado correctamente",
        data: result,
      });
    } catch (error) {
      console.error("Error en register:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Error al registrar usuario",
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        data: result,
      });
    } catch (error) {
      console.error("Error en login:", error);

      const statusCode =
        error.message === "Credenciales incorrectas" ? 401 : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Error al iniciar sesión",
      });
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: "Token renovado correctamente",
        data: result,
      });
    } catch (error) {
      console.error("Error en refresh:", error);
      res.status(403).json({
        success: false,
        message: error.message || "Error al renovar token",
      });
    }
  }

  async me(req, res) {
    try {
      const userId = req.userId;

      const user = await authService.getCurrentUser(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error en me:", error);
      res.status(404).json({
        success: false,
        message: error.message || "Usuario no encontrado",
      });
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.body;

      const result = await authService.logout(refreshToken);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error en logout:", error);
      res.status(404).json({
        success: false,
        message: error.message || "Error al cerrar sesión",
      });
    }
  }

  async recovery(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email requerido",
        });
      }

      const result = await authService.sendRecovery(email);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async validateRecoveryToken(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Token requerido",
        });
      }

      const result = await authService.validateToken(token);

      if (!result.valid) {
        return res.status(400).json({
          success: false,
          message: "Token inválido o expirado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Token válido",
      });
    } catch (error) {
      console.error("Error en validateRecoveryToken:", error);

      res.status(500).json({
        success: false,
        message: "Error al validar token",
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Token y nueva contraseña requeridos",
        });
      }

      const result = await authService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("Error en resetPassword:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Error al restablecer contraseña",
      });
    }
  }
}

module.exports = new AuthController();
