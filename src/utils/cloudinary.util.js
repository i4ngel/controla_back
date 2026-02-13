const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;

class CloudinaryUtil {
  async uploadImage(filePath, options = {}) {
    try {
      const defaultOptions = {
        folder: "perfil_users",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        resource_type: "auto",
      };

      const uploadOptions = { ...defaultOptions, ...options };

      const result = await cloudinary.uploader.upload(filePath, uploadOptions);

      await this.deleteLocalFile(filePath);

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      await this.deleteLocalFile(filePath);
      throw new Error(`Error al subir imagen a Cloudinary: ${error.message}`);
    }
  }

  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error) {
      throw new Error(
        `Error al eliminar imagen de Cloudinary: ${error.message}`
      );
    }
  }

  async deleteLocalFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Error al eliminar archivo local:", error.message);
    }
  }

  extractPublicIdFromUrl(url) {
    if (!url) return null;

    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const publicId = filename.split(".")[0];
    const folder = parts[parts.length - 2];

    return `${folder}/${publicId}`;
  }

  validateImageFile(file) {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!file) {
      throw new Error("No se proporcionó ningún archivo");
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(
        "Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, GIF, WEBP)"
      );
    }

    if (file.size > maxSize) {
      throw new Error("El archivo es demasiado grande. Tamaño máximo: 5MB");
    }

    return true;
  }
}

module.exports = new CloudinaryUtil();
