const mongoose = require("mongoose");

const { Schema } = mongoose;

const schemaSample = new Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      index: { unique: true },
    },
    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
        },
        cantidad: {
          type: mongoose.Schema.Types.Number,
        },
      },
    ],
  },
  {
    autoCreate: true,
    collection: "carritos",
    strict: true,
  }
);

const model = mongoose.model("Carrito", schemaSample);
module.exports = model;
