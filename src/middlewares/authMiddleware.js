const jwtUtil = require("../utils/jwt.util");
const userRepository = require("../repositories/user.repository");

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    const token = jwtUtil.extractTokenFromHeader(authHeader);

    const decoded = await jwtUtil.verifyAccessToken(token);

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (!user.isActive()) {
      return res.status(403).json({
        success: false,
        message: "Usuario inactivo o suspendido",
      });
    }

    req.userId = decoded.id;
    req.user = user; 

    next();
  } catch (error) {
    console.error("Error en verifyToken:", error);

    if (error.message === "No authorization header provided") {
      return res.status(401).json({
        success: false,
        message: "Token de autenticación requerido",
      });
    }

    if (error.message === "Invalid token format") {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido. Use: Bearer <token>",
      });
    }

    // Error de JWT (expirado, inválido, etc.)
    return res.status(403).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
};

/**
 * Verificar que el usuario sea ADMIN
 */
exports.verifyAdmin = async (req, res, next) => {
  try {
    // Este middleware debe usarse DESPUÉS de verifyToken
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    if (!req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. Se requieren privilegios de administrador",
      });
    }

    next();
  } catch (error) {
    console.error("Error en verifyAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Error al verificar permisos",
    });
  }
};

/**
 * Verificar roles específicos
 */
exports.verifyRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "No autorizado",
        });
      }

      if (!allowedRoles.includes(req.user.perfil)) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para acceder a este recurso",
        });
      }

      next();
    } catch (error) {
      console.error("Error en verifyRoles:", error);
      return res.status(500).json({
        success: false,
        message: "Error al verificar permisos",
      });
    }
  };
};
