const emailService = require("../services/email.service");

exports.sendTest = async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res
        .status(400)
        .json({ message: "Se requiere el correo destinatario" });
    }

    const result = await emailService.sendTestEmail(to);

    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
