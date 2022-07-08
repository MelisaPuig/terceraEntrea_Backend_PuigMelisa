const mongoose = require("mongoose");

const { Schema } = mongoose;

const schemaSample = new Schema(
  {
    nombre: {
      type: Schema.Types.String,
      required: [true, "Debe tener un nombre."],
      minlength: [1, "Debe tener al menos 1 letra de largo."],
      maxlength: [100, "No puede tener más de 100 letras de largo."],
      index: { unique: true },
    },
    descripcion: {
      type: Schema.Types.String,
      required: [true, "Debe tener una descripción."],
    },
    foto: {
      type: Schema.Types.String,
      required: [true, "Debe tener una foto."],
    },
    precio: {
      type: Schema.Types.Number,
      required: [true, "Debe tener un precio."],
      min: [0, "El precio no puede ser menor a 0!"],
    },
    codigo: {
      type: Schema.Types.String,
      required: [true, "Debe tener un código"],
      minlength: [1, "El código tiene que tener al menos una letra!"],
      maxlength: [100, "No puede tener más de 100 letras de largo."],
    },
    timestamp: {
      type: Schema.Types.Date,
      required: [true, "Debe tener timestamp"],
    },
    stock: {
      type: Schema.Types.Number,
      required: [true, "Debe tener un stock"],
      min: [0, "El stock no puede ser menor a 0!"],
    },
  },
  {
    autoCreate: true,
    collection: "productos",
    strict: true,
  }
);

const model = mongoose.model("Producto", schemaSample);
module.exports = model;
