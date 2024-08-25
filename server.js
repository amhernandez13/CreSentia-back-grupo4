import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import terapeutaRoutes from "./routes/terapeutaRoutes.js";
import "./config/mongoose.config.js"; // Importar la configuración de Mongoose

dotenv.config();

const app = express();

app.use(cors());
app.use(express.static("public"));

// Rutas
app.use("/api/terapeutas", terapeutaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
