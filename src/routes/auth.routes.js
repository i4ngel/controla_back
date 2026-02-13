/**
 * Auth Routes
 * Define todas las rutas de autenticación con sus validaciones y middlewares
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  validateRegister,
  validateLogin,
  validateRefresh,
  validateLogout,
} = require("../validations/auth.validation");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operaciones de autenticación
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - email
 *               - password
 *               - usuario
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Perez
 *               email:
 *                 type: string
 *                 example: juan@mail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               usuario:
 *                 type: string
 *                 example: juanp
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Error de validación o email/usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post("/register", validateRegister, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@mail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     user:
 *                       type: object
 *       401:
 *         description: Credenciales incorrectas
 *       400:
 *         description: Error de validación
 */
router.post("/login", validateLogin, authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Obtener nuevo access token usando refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nuevo access token generado
 *       403:
 *         description: Refresh token inválido o expirado
 */
router.post("/refresh", validateRefresh, authController.refresh);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario autenticado
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Token inválido
 */
router.get("/me", verifyToken, authController.me);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión y eliminar refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de refresco que se desea eliminar
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       404:
 *         description: Token no encontrado
 */
router.post("/logout", validateLogout, authController.logout);
/**
 * @swagger
 * /api/auth/recovery:
 *   post:
 *     summary: Enviar correo de recuperación de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario que solicita recuperación
 *                 example: usuario@gmail.com
 *     responses:
 *       200:
 *         description: Si el correo existe, se envía el enlace de recuperación
 *       400:
 *         description: Email requerido o formato inválido
 *       500:
 *         description: Error al enviar el correo
 */
router.post("/recovery", authController.recovery);

/**
 * @swagger
 * /api/auth/validate-recovery-token:
 *   post:
 *     summary: Validar token de recuperación de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT enviado por correo electrónico
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/validate-recovery-token", authController.validateRecoveryToken);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Restablecer contraseña usando token de recuperación
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT de recuperación
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *                 example: NuevaPassword123!
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos o contraseña débil
 *       401:
 *         description: Token inválido o expirado 
 *       500:
 *         description: Error interno del servidor
 */
router.post("/reset-password", authController.resetPassword);

module.exports = router;
