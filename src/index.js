const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const emailRoutes = require("./routes/email.routes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const app = express();

app.use(cors());
app.use(bodyParser.json());

/* ====== LOGGER MIDDLEWARE ====== */
app.use((req, res, next) => {
  const start = Date.now();

  console.log("=================================");
  console.log("REQUEST:");
  console.log("Metodo:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Body:", req.body);

  // interceptar respuesta
  const oldSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;

    console.log("RESPONSE:");
    console.log("Status:", res.statusCode);
    console.log("Tiempo:", duration + "ms");
    console.log("Respuesta:", data);
    console.log("=================================");

    return oldSend.apply(res, arguments);
  };

  next();
});
/* =============================== */

// rutas
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/email", emailRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
