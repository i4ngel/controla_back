const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;

class CloudinaryUtil {
  async uploadImage(fileBuffer) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "perfil_users",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(
              new Error(`Error al subir imagen a Cloudinary: ${error.message}`)
            );
          }
  
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
          });
        }
      );
  
      stream.end(fileBuffer);
    });
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
