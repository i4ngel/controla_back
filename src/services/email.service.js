const { sendEmail } = require("../config/email.config");

exports.sendTestEmail = async (to) => {
  try {
    const subject = "Correo de prueba";
    const text = "Hola, este es un correo de prueba enviado desde Node.js";
    const html =
      "<h1>Hola</h1><p>Este es un correo de prueba enviado desde Node.js</p>";

    const info = await sendEmail({ to, subject, text, html });

    return {
      message: "Correo de prueba enviado correctamente",
      info: info.response,
    };
  } catch (error) {
    throw {
      status: 500,
      message: "No se pudo enviar el correo: " + error.message,
    };
  }
};
