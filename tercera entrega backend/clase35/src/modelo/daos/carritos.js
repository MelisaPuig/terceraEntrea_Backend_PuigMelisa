const mongoModel = require("../orm/Carrito");

class CarritoDAO {
  async create(userId) {
    try {
      const dataCarrito = {
        usuario: userId,
        productos: [],
      };
      const newCarrito = new mongoModel(dataCarrito);
      const result = await newCarrito.save();
      return result;
    } catch (error) {
      throw new Error(
        `Ha ocurrido un error agregando el contenido: ${JSON.stringify(error)}`
      );
    }
  }

  async getByUserId(userId) {
    try {
      const existingCarrito = await mongoModel
        .findOne({ userId })
        .populate("productos.producto")
        .lean();
      if (existingCarrito) {
        delete existingCarrito.userId;
        delete existingCarrito.__v;
        return existingCarrito;
      }
      const newCarrito = await this.create(userId);
      return this.getByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      return mongoModel.find().lean();
    } catch (error) {
      throw error;
    }
  }

  async setProductCountByUserAndProductId(userId, productId, count) {
    try {
      const userCarrito = await this.getByUserId(userId);
      let products = userCarrito.productos;
      const thisProductIndex = products.findIndex(
        (e) => e.producto._id.toString() === productId
      );
      if (thisProductIndex > -1) {
        products[thisProductIndex].cantidad = count;
      } else {
        products.push({ producto: productId, cantidad: count });
      }
      products = products.filter((e) => e.cantidad !== 0);
      await mongoModel.updateOne(
        { usuario: userId },
        { $set: { productos: products } }
      );
      return this.getByUserId(userId);
    } catch (error) {
      throw new Error(`Ha ocurrido un error agregando el contenido: ${error}`);
    }
  }

  async emptyByUserId(userId) {
    try {
      const productos = [];
      await mongoModel.updateOne({ usuario: userId }, { $set: productos });
      return this.getByUserId(userId);
    } catch (error) {
      throw new Error(`Ha ocurrido un error agregando el contenido: ${error}`);
    }
  }

  async deleteByUserId(userId) {
    try {
      await mongoModel.findOneAndDelete({ usuario: userId });
    } catch (error) {
      throw error;
    }
  }

  async deleteAll() {
    try {
      await mongoModel.deleteMany({});
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * PRIVATE METHODS
   *
   */
}

module.exports = CarritoDAO;
