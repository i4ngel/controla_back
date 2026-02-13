const jwt = require("jsonwebtoken");

class JWTUtil {
  /**
   * Generar access token
   */
  generateAccessToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m",
    });
  }

  /**
   * Generar refresh token
   */
  generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || "7d",
    });
  }

  /**
   * Generar ambos tokens
   */
  generateTokens(userId) {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  }

  /**
   * Verificar access token
   */
  verifyAccessToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });
  }

  /**
   * Verificar refresh token
   */
  verifyRefreshToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });
  }

  generateRecoveryToken(userId) {
    return jwt.sign(
      { userId, type: "recovery" },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );
  }
  
  /**
   * Extraer token del header Authorization
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new Error("Invalid token format");
    }

    return parts[1];
  }
  generateRecoveryToken(userId) {
    return jwt.sign(
      { userId, type: "recovery" },
      process.env.JWT_RECOVERY_SECRET,
      { expiresIn: process.env.JWT_RECOVERY_EXPIRATION || "30m" }
    );
  }
  verifyRecoveryToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_RECOVERY_SECRET, (err, decoded) => {
        if (err) return reject(err);
  
        // Validar que sea token de recovery
        if (decoded.type !== "recovery") {
          return reject(new Error("Token inválido"));
        }
  
        resolve(decoded);
      });
    });
  }
  
}

module.exports = new JWTUtil();
