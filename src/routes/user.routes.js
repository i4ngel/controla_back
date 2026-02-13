const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload.middleware");
const {
  validateUpdateProfile,
  validateChangePassword,
} = require("../validations/user.validation");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operaciones de gestión de usuarios
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     apellido:
 *                       type: string
 *                     email:
 *                       type: string
 *                     usuario:
 *                       type: string
 *                     perfil:
 *                       type: string
 *                     foto_perfil:
 *                       type: string
 *       401:
 *         description: Token requerido
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/profile", verifyToken, userController.profile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Pérez
 *               usuario:
 *                 type: string
 *                 example: juanp
 *               email:
 *                 type: string
 *                 example: juan@mail.com
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       400:
 *         description: Error de validación o datos duplicados
 *       401:
 *         description: Token requerido
 */
router.put(
  "/profile",
  verifyToken,
  validateUpdateProfile,
  userController.updateProfile
);

/**
 * @swagger
 * /api/user/profile/photo:
 *   put:
 *     summary: Actualizar foto de perfil del usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil (JPEG, PNG, GIF, WEBP - máx 5MB)
 *     responses:
 *       200:
 *         description: Imagen de perfil actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 foto_perfil:
 *                   type: string
 *       400:
 *         description: Archivo requerido o tipo de archivo inválido
 *       401:
 *         description: Token requerido
 */
router.put(
  "/profile/photo",
  verifyToken,
  upload.single("file"),
  userController.updateProfileImage
);

/**
 * @swagger
 * /api/user/profile/password:
 *   put:
 *     summary: Cambiar contraseña del usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: password123
 *               newPassword:
 *                 type: string
 *                 example: newpassword456
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Contraseña actual incorrecta o validación fallida
 *       401:
 *         description: Token requerido
 */
router.put(
  "/profile/password",
  verifyToken,
  validateChangePassword,
  userController.changePassword
);

/**
 * @swagger
 * /api/user/profile:
 *   delete:
 *     summary: Eliminar cuenta de usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario para confirmar eliminación
 *     responses:
 *       200:
 *         description: Cuenta eliminada correctamente
 *       400:
 *         description: Contraseña incorrecta
 *       401:
 *         description: Token requerido
 */
router.delete("/profile", verifyToken, userController.deleteAccount);

/**
 * @swagger
 * /api/user/desactivate:
 *   put:
 *     summary: Desactivar cuenta de usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario para confirmar desactivación
 *     responses:
 *       200:
 *         description: Cuenta desactivada correctamente
 *       400:
 *         description: Contraseña incorrecta
 *       401:
 *         description: Token requerido
 */
router.put("/desactivate", verifyToken, userController.desactivateAccount);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Obtener todos los usuarios (solo admin)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: integer
 *           enum: [0, 1, 2]
 *         description: Filtrar por estado (0=INACTIVE, 1=ACTIVE, 2=SUSPENDED)
 *       - in: query
 *         name: perfil
 *         schema:
 *           type: string
 *           enum: [USER, ADMIN, MODERATOR]
 *         description: Filtrar por rol
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre, apellido, email o usuario
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: integer
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Acceso denegado - se requieren privilegios de administrador
 */
router.get("/", verifyToken, verifyAdmin, userController.getAllUsers);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Obtener usuario por ID (solo admin)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Información del usuario
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", verifyToken, verifyAdmin, userController.getUserById);

/**
 * @swagger
 * /api/user/{id}/status:
 *   put:
 *     summary: Actualizar estado de usuario (solo admin)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: integer
 *                 enum: [0, 1, 2]
 *                 description: Estado (0=INACTIVE, 1=ACTIVE, 2=SUSPENDED)
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Usuario no encontrado
 */
router.put(
  "/:id/status",
  verifyToken,
  verifyAdmin,
  userController.updateUserStatus
);

/**
 * @swagger
 * /api/user/profile/verify-password:
 *   post:
 *     summary: Verificar contraseña del usuario autenticado
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Resultado de la verificación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isValid:
 *                   type: boolean
 *       400:
 *         description: Error en la verificación
 *       401:
 *         description: Token requerido
 */
router.post(
  "/profile/verify-password",
  verifyToken,
  userController.verifyPassword
);

module.exports = router;
