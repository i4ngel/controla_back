const connection = require("../config/db");
const { User } = require("../models/user.model");

class UserRepository {
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

  async updateRefreshToken(userId, refreshToken) {
    const sql = "UPDATE usuarios SET refresh_token = ? WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [refreshToken, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  async removeRefreshToken(userId) {
    const sql = "UPDATE usuarios SET refresh_token = NULL WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  async emailExists(email) {
    const sql = "SELECT COUNT(*) as count FROM usuarios WHERE email = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].count > 0);
      });
    });
  }

  async usernameExists(usuario) {
    const sql = "SELECT COUNT(*) as count FROM usuarios WHERE usuario = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [usuario], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].count > 0);
      });
    });
  }

  async updateProfileImage(userId, imageUrl) {
    const sql = "UPDATE usuarios SET foto_perfil = ? WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [imageUrl, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  async updateProfile(userId, updateData) {
    const fields = [];
    const values = [];

    if (updateData.nombre !== undefined) {
      fields.push("nombre = ?");
      values.push(updateData.nombre);
    }
    if (updateData.apellido !== undefined) {
      fields.push("apellido = ?");
      values.push(updateData.apellido);
    }
    if (updateData.usuario !== undefined) {
      fields.push("usuario = ?");
      values.push(updateData.usuario);
    }
    if (updateData.email !== undefined) {
      fields.push("email = ?");
      values.push(updateData.email);
    }

    if (fields.length === 0) {
      return Promise.resolve(false);
    }

    values.push(userId);
    const sql = `UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`;

    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  async updatePassword(userId, newPasswordHash) {
    const sql = "UPDATE usuarios SET password = ? WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [newPasswordHash, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  async deleteUser(userId) {
    const sql = "DELETE FROM usuarios WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  async updateStatus(userId, status) {
    const sql = "UPDATE usuarios SET estado = ? WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [status, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  async findAll(filters = {}) {
    let sql = "SELECT * FROM usuarios WHERE 1=1";
    const values = [];

    if (filters.estado !== undefined) {
      sql += " AND estado = ?";
      values.push(filters.estado);
    }

    if (filters.perfil) {
      sql += " AND perfil = ?";
      values.push(filters.perfil);
    }

    if (filters.search) {
      sql +=
        " AND (nombre LIKE ? OR apellido LIKE ? OR email LIKE ? OR usuario LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results.map((row) => new User(row)));
      });
    });
  }
}

module.exports = new UserRepository();
