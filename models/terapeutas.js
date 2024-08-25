import mongoose from "mongoose";

const TerapeutaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    apodo: {
      type: String,
      required: true,
    },
    sexo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    identificacion: {
      type: String,
      required: true,
    },
    eps: {
      type: String,
      required: true,
    },
    fechaNacimiento: {
      type: Date,
      required: true,
    },
    pais: {
      type: String,
      required: true,
    },
    ciudad: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    foto: {
      type: String, // Ruta de la foto de perfil si la hay
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Terapeuta = mongoose.model("Terapeuta", TerapeutaSchema);

export default Terapeuta;
