const { sendEmail } = require("../config/email.config");

class EmailUtil {
  async sendRecoveryEmail(to, token) {
    const recoveryLink = `http://localhost:4200/auth/recoverypassword/${token}`;
  
    return sendEmail({
      from: `"Soporte de" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Restablecimiento de contraseña",
      html: `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:30px;font-family:Arial,Helvetica,sans-serif;">
              <tr>
                <td style="text-align:center;">
                  <h2 style="color:#2c3e50;">Restablece tu contraseña</h2>
                </td>
              </tr>
  
              <tr>
                <td style="color:#555;font-size:14px;padding:10px 0;">
                  Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.  
                  Haz clic en el botón a continuación para crear una nueva contraseña de manera segura.
                </td>
              </tr>
  
              <tr>
                <td align="center" style="padding:25px 0;">
                  <a href="${recoveryLink}"
                    style="
                      background-color:#3085d6;
                      color:#ffffff;
                      padding:14px 28px;
                      text-decoration:none;
                      border-radius:6px;
                      font-weight:bold;
                      display:inline-block;
                      font-size:16px;
                    ">
                    Restablecer contraseña
                  </a>
                </td>
              </tr>
  
              <tr>
                <td style="color:#777;font-size:12px;padding-top:20px;">
                  Este enlace expirará en 30 minutos por motivos de seguridad.
                </td>
              </tr>
  
              <tr>
                <td style="color:#999;font-size:12px;padding-top:10px;">
                  Si no solicitaste este cambio, puedes ignorar este mensaje o contactar con nuestro soporte.
                </td>
              </tr>
  
              <tr>
                <td style="color:#999;font-size:12px;padding-top:20px; text-align:center;">
                  &copy; ${new Date().getFullYear()}. Todos los derechos reservados.
                </td>
              </tr>
  
            </table>
          </td>
        </tr>
      </table>
      `,
    });
  }
  
  async sendWelcomeEmail(to, nombre) {
    return sendEmail({
      from: `"Equipo Plataforma" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Bienvenido a la plataforma",
      html: `<p>Hola ${nombre}, bienvenido.</p>`,
    });
  }
}

module.exports = new EmailUtil();
