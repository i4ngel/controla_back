const UserRoles = {
  ADMIN: "ADMIN",
  USER: "USER",
  MODERATOR: "MODERATOR",
};

const UserStatus = {
  ACTIVE: 1,
  INACTIVE: 0,
  SUSPENDED: 2,
};

class User {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.email = data.email;
    this.password = data.password;
    this.usuario = data.usuario;
    this.estado = data.estado || UserStatus.ACTIVE;
    this.perfil = data.perfil || UserRoles.USER;
    this.foto_perfil = data.foto_perfil ||data.perfil|| null;
    this.refresh_token = data.refresh_token || null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  toPublicJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      usuario: this.usuario,
      estado: this.estado,
      perfil: this.perfil,
      foto_perfil: this.foto_perfil,
      created_at: this.created_at,
    };
  }

  toProfileJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      usuario: this.usuario,
      perfil: this.perfil,
      foto_perfil: this.foto_perfil,
    };
  }

  isActive() {
    return this.estado === UserStatus.ACTIVE;
  }

  isAdmin() {
    return this.perfil === UserRoles.ADMIN;
  }

  hasRole(role) {
    return this.perfil === role;
  }
  setPassword(hashedPassword) {
    this.password = hashedPassword;
  }
}

module.exports = {
  User,
  UserRoles,
  UserStatus,
};
