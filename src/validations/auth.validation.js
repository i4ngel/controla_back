/**
 * Auth Validations
 * Validaciones para las rutas de autenticación
 */

const { body, validationResult } = require("express-validator");

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validación para registro
 */
const validateRegister = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido es requerido")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("usuario")
    .trim()
    .notEmpty()
    .withMessage("El usuario es requerido")
    .isLength({ min: 3, max: 30 })
    .withMessage("El usuario debe tener entre 3 y 30 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "El usuario solo puede contener letras, números y guiones bajos"
    ),

  handleValidationErrors,
];

/**
 * Validación para login
 */
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("La contraseña es requerida"),

  handleValidationErrors,
];

/**
 * Validación para refresh token
 */
const validateRefresh = [
  body("refreshToken").notEmpty().withMessage("El refresh token es requerido"),

  handleValidationErrors,
];

/**
 * Validación para logout
 */
const validateLogout = [
  body("refreshToken").notEmpty().withMessage("El refresh token es requerido"),

  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateRefresh,
  validateLogout,
};
