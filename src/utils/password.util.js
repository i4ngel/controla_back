/**
 * Password Utility
 * Maneja el hash y verificación de contraseñas
 */

const bcrypt = require("bcrypt");

class PasswordUtil {
  constructor() {
    this.saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  }

  /**
   * Encriptar contraseña
   */
  async hash(password) {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Verificar contraseña
   */
  async compare(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Validar fortaleza de contraseña
   * Mínimo 6 caracteres (puedes ajustar según tus necesidades)
   */
  validateStrength(password) {
    const errors = [];

    if (password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres");
    }

    if (password.length > 100) {
      errors.push("La contraseña es demasiado larga");
    }

    // Puedes agregar más validaciones:
    // - Mayúsculas
    // - Números
    // - Caracteres especiales

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = new PasswordUtil();
