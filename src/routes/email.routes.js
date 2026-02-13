const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email.controller"); // ajustar si es CommonJS
const { verifyToken } = require("../middlewares/authMiddleware");

module.exports = router;

/**
 * @swagger
 * /api/email/test:
 *   post:
 *     summary: Enviar correo de prueba
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Correo electrónico del destinatario
 *                 example: reginaldoeduado@gmail.com
 *     responses:
 *       200:
 *         description: Correo enviado correctamente
 *       400:
 *         description: Falta el correo destinatario
 *       401:
 *         description: Token requerido
 *       500:
 *         description: Error al enviar correo
 */
router.post("/test", emailController.sendTest);

module.exports = router;
