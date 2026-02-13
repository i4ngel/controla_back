const connection = require("../config/db");
const { User } = require("../models/user.model");

class UserRepository {
  /**
   * Crear un nuevo usuario
   */
  async create(userData) {
    const sql = `
      INSERT INTO usuarios
      (nombre, apellido, email, password, usuario, estado, perfil)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      connection.query(
        sql,
        [
          userData.nombre,
          userData.apellido,
          userData.email,
          userData.password,
          userData.usuario,
          userData.estado,
          userData.perfil,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve({ id: result.insertId, ...userData });
        }
      );
    });
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email) {
    const sql = "SELECT * FROM usuarios WHERE email = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [email], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        resolve(new User(results[0]));
      });
    });
  }

  /**
   * Buscar usuario por username
   */
  async findByUsername(usuario) {
    const sql = "SELECT * FROM usuarios WHERE usuario = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [usuario], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        resolve(new User(results[0]));
      });
    });
  }

  /**
   * Buscar usuario por ID
   */
  async findById(id) {
    const sql = "SELECT * FROM usuarios WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        resolve(new User(results[0]));
      });
    });
  }

  /**
   * Buscar usuario por refresh token
   */
  async findByRefreshToken(refreshToken) {
    const sql = "SELECT * FROM usuarios WHERE refresh_token = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [refreshToken], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        resolve(new User(results[0]));
      });
    });
  }

  /**
   * Actualizar refresh token del usuario
   */
  async updateRefreshToken(userId, refreshToken) {
    const sql = "UPDATE usuarios SET refresh_token = ? WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [refreshToken, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  /**
   * Eliminar refresh token (logout)
   */
  async removeRefreshToken(userId) {
    const sql = "UPDATE usuarios SET refresh_token = NULL WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  /**
   * Verificar si existe un email
   */
  async emailExists(email) {
    const sql = "SELECT COUNT(*) as count FROM usuarios WHERE email = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].count > 0);
      });
    });
  }

  /**
   * Verificar si existe un username
   */
  async usernameExists(usuario) {
    const sql = "SELECT COUNT(*) as count FROM usuarios WHERE usuario = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [usuario], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].count > 0);
      });
    });
  }

  /**
   * Actualizar contraseña del usuario
   */
  async updatePassword(userId, hashedPassword) {
    const sql = "UPDATE usuarios SET password = ? WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [hashedPassword, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  /**
   * Eliminar todos los refresh tokens del usuario
   */
  async removeAllRefreshTokens(userId) {
    const sql = "UPDATE usuarios SET refresh_token = NULL WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
}

module.exports = new UserRepository();
