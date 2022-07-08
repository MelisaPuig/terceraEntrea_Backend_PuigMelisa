const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;

const schemaSample = new Schema(
  {
    email: {
      type: Schema.Types.String,
      required: [true, "Debe tener un correo electrónico."],
      validate: [validator.isEmail, "invalid email"],
      index: { unique: true },
    },
    password: {
      type: Schema.Types.String,
      required: [true, "Debe tener una contraseña."],
    },
    nombre: {
      type: Schema.Types.String,
      required: [true, "Debe tener un nombre."],
      minlength: [1, "Debe tener al menos 1 letra de largo."],
      maxlength: [100, "No puede tener más de 100 letras de largo."],
    },
    domicilio: {
      type: Schema.Types.String,
      required: [true, "Debe tener una descripción."],
      minlength: [1, "Debe tener al menos 1 letra de largo."],
      maxlength: [100, "No puede tener más de 100 letras de largo."],
    },
    edad: {
      type: Schema.Types.Number,
      required: [true, "Debe tener una edad."],
      minlength: [1, "Debe tener al menos 1 año."],
      maxlength: [100, "No puede tener más de 100 años."],
    },
    numeroTelefono: {
      type: Schema.Types.String,
      required: [true, "Debe tener un teléfono."],
      minlength: [1, "Debe tener al menos 1 letra de largo."],
      maxlength: [100, "No puede tener más de 100 letras de largo."],
    },
  },
  {
    autoCreate: true,
    collection: "usuarios",
    strict: true,
  }
);

const model = mongoose.model("Usuario", schemaSample);
module.exports = model;
