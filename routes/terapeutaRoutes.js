import express from "express";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Terapeuta from "../models/terapeutas.js";

// Definir __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.post("/", (req, res) => {
  const form = formidable({
    uploadDir: path.join(__dirname, "../uploads"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
    multiples: false, // Esto debería evitar múltiples archivos, pero haremos una verificación extra
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al procesar el formulario:", err);
      return res.status(500).json({ error: "Error al procesar el formulario" });
    }

    console.log("Campos recibidos:", fields);
    console.log("Archivo recibido:", files);

    // Asegurarnos de manejar solo un archivo bajo el campo 'foto'
    let fotoFile;
    if (Array.isArray(files.foto)) {
      // Si recibimos múltiples archivos (lo que no debería suceder), tomamos el primero
      fotoFile = files.foto[0];
    } else {
      fotoFile = files.foto;
    }

    if (!fotoFile) {
      return res
        .status(400)
        .json({ error: "No se ha subido ningún archivo de foto" });
    }

    // Eliminar cualquier archivo duplicado antes de continuar
    if (Array.isArray(files.foto) && files.foto.length > 1) {
      for (let i = 1; i < files.foto.length; i++) {
        fs.unlink(files.foto[i].filepath, (err) => {
          if (err) console.error("Error al eliminar archivo duplicado:", err);
        });
      }
    }

    const {
      nombre,
      apodo,
      sexo,
      email,
      identificacion,
      eps,
      fechaNacimiento,
      pais,
      ciudad,
    } = fields;

    const password = fields.password ? fields.password[0] : null;

    try {
      // Verificar si el usuario ya existe
      let terapeuta = await Terapeuta.findOne({ email: email[0] });
      if (terapeuta) {
        return res.status(400).json({ msg: "El usuario ya existe" });
      }

      // Crear un nuevo usuario
      terapeuta = new Terapeuta({
        nombre: nombre[0],
        apodo: apodo[0],
        sexo: sexo[0],
        email: email[0],
        identificacion: identificacion[0],
        eps: eps[0],
        fechaNacimiento: fechaNacimiento[0],
        pais: pais[0],
        ciudad: ciudad[0],
        password,
        foto: path.basename(fotoFile.filepath), // Guardar la ruta del archivo
      });

      // Hashear la contraseña antes de guardarla
      const salt = await bcrypt.genSalt(10);
      terapeuta.password = await bcrypt.hash(password, salt);

      // Guardar el usuario en la base de datos
      await terapeuta.save();

      res.status(201).json({ msg: "Usuario registrado con éxito" });
    } catch (err) {
      console.error("Error al registrar usuario:", err.message);
      res.status(500).send("Error del servidor");
    }
  });
});

export default router;
