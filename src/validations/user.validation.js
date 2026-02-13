const { body, validationResult } = require("express-validator");

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

const validateUpdateProfile = [
  body("nombre")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("apellido")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres"),

  body("usuario")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("El usuario debe tener entre 3 y 30 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "El usuario solo puede contener letras, números y guiones bajos"
    ),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  handleValidationErrors,
];

const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("La contraseña actual es requerida"),

  body("newPassword")
    .notEmpty()
    .withMessage("La nueva contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("La confirmación de contraseña es requerida")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Las contraseñas no coinciden"),

  handleValidationErrors,
];

module.exports = {
  validateUpdateProfile,
  validateChangePassword,
};
