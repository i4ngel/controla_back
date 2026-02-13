const userService = require("../services/user.service");

class UserController {
  async profile(req, res) {
    try {
      const user = await userService.getProfile(req.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error en profile:", error);
      res.status(404).json({
        success: false,
        message: error.message || "Usuario no encontrado",
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const updateData = req.body;
      const user = await userService.updateProfile(req.userId, updateData);

      res.status(200).json({
        success: true,
        message: "Perfil actualizado correctamente",
        data: user,
      });
    } catch (error) {
      console.error("Error en updateProfile:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Error al actualizar perfil",
      });
    }
  }

  async updateProfileImage(req, res) {
    try {
      const result = await userService.updateProfileImage(req.userId, req.file);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error en updateProfileImage:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Error al actualizar imagen de perfil",
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(
        req.userId,
        currentPassword,
        newPassword
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error en changePassword:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Error al cambiar contraseña",
      });
    }
  }

  async deleteAccount(req, res) {
    try {
      const { password } = req.body;
      const result = await userService.deleteAccount(req.userId, password);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error en deleteAccount:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Error al eliminar cuenta",
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const filters = {
        estado: req.query.estado,
        perfil: req.query.perfil,
        search: req.query.search,
      };

      const users = await userService.getAllUsers(filters);

      res.status(200).json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      console.error("Error en getAllUsers:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Error al obtener usuarios",
      });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error en getUserById:", error);
      res.status(404).json({
        success: false,
        message: error.message || "Usuario no encontrado",
      });
    }
  }

  async updateUserStatus(req, res) {
    try {
      const { status } = req.body;
      const result = await userService.updateUserStatus(req.params.id, status);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error en updateUserStatus:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Error al actualizar estado del usuario",
      });
    }
  }
}

module.exports = new UserController();
