const userRepository = require("../repositories/user.repository");
const cloudinaryUtil = require("../utils/cloudinary.util");
const passwordUtil = require("../utils/password.util");

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user.toProfileJSON();
  }

  async updateProfile(userId, updateData) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await userRepository.emailExists(updateData.email);
      if (emailExists) {
        throw new Error("El email ya está en uso");
      }
    }

    if (updateData.usuario && updateData.usuario !== user.usuario) {
      const usernameExists = await userRepository.usernameExists(
        updateData.usuario
      );
      if (usernameExists) {
        throw new Error("El nombre de usuario ya está en uso");
      }
    }

    await userRepository.updateProfile(userId, updateData);

    const updatedUser = await userRepository.findById(userId);
    return updatedUser.toProfileJSON();
  }

  async updateProfileImage(userId, file) {
    if (!file) {
      throw new Error("Archivo de imagen requerido");
    }

    cloudinaryUtil.validateImageFile(file);

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (user.foto_perfil) {
      const publicId = cloudinaryUtil.extractPublicIdFromUrl(user.foto_perfil);
      if (publicId) {
        await cloudinaryUtil
          .deleteImage(publicId)
          .catch((err) =>
            console.error("Error al eliminar imagen anterior:", err)
          );
      }
    }

    const uploadResult = await cloudinaryUtil.uploadImage(file.path, {
      folder: "perfil_users",
    });

    await userRepository.updateProfileImage(userId, uploadResult.url);

    return {
      message: "Imagen de perfil actualizada correctamente",
      foto_perfil: uploadResult.url,
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const isPasswordValid = await passwordUtil.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("La contraseña actual es incorrecta");
    }

    const passwordValidation = passwordUtil.validateStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(", "));
    }

    const hashedPassword = await passwordUtil.hash(newPassword);
    await userRepository.updatePassword(userId, hashedPassword);

    return {
      message: "Contraseña actualizada correctamente",
    };
  }

  async deleteAccount(userId, password) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const isPasswordValid = await passwordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta");
    }

    if (user.foto_perfil) {
      const publicId = cloudinaryUtil.extractPublicIdFromUrl(user.foto_perfil);
      if (publicId) {
        await cloudinaryUtil
          .deleteImage(publicId)
          .catch((err) =>
            console.error("Error al eliminar imagen de perfil:", err)
          );
      }
    }

    await userRepository.deleteUser(userId);

    return {
      message: "Cuenta eliminada correctamente",
    };
  }

  async desactivateAccount(userId, password) {
    const user = await userRepository.findById(userId);
  
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
  
    const isPasswordValid = await passwordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta");
    }
  
    await userRepository.updateStatus(userId, 0);
  
    return {
      message: "Cuenta desactivada correctamente",
    };
  }
  
  async getAllUsers(filters = {}) {
    const users = await userRepository.findAll(filters);
    return users.map((user) => user.toPublicJSON());
  }

  async getUserById(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user.toPublicJSON();
  }

  async updateUserStatus(userId, status) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    await userRepository.updateStatus(userId, status);

    return {
      message: "Estado del usuario actualizado correctamente",
    };
  }
}

module.exports = new UserService();
