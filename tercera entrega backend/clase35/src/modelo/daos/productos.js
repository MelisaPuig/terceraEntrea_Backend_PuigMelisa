const mongoModel = require("../orm/Producto");

const PRODUCT_REQUIRED_PROPERTIES = [
  "nombre",
  "descripcion",
  "foto",
  "precio",
  "stock",
];

class ProductoDAO {
  async exists(id) {
    try {
      const searched = await this.getById(id);
      return searched !== null;
    } catch (error) {
      throw error;
    }
  }

  async save(newProduct) {
    try {
      this._throwErrorIfInvalidProduct(newProduct);
      newProduct.timestamp = new Date();
      newProduct.codigo = Math.random().toString(36);
      let productId = 0;
      const mongoNewProduct = new mongoModel(newProduct);
      const result = await mongoNewProduct.save();
      return result;
    } catch (error) {
      console.error(error.message);
      throw new Error(`Ha ocurrido un error agregando el contenido: ${error}`);
    }
  }

  async getById(id) {
    try {
      const searchedFound = await mongoModel.findOne({ _id: id }).lean();
      if (!searchedFound) {
        return null;
      }
      return searchedFound;
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

  async update(id, productData) {
    try {
      const existingEntry = await this.exists(id);
      if (!existingEntry) {
        throw new Error(`No existe la entrada con el Id: ${id}`);
      }
      await mongoModel.updateOne({ _id: id }, { $set: productData });
      return this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      await mongoModel.findOneAndDelete({ _id: id });
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

  _throwErrorIfInvalidProduct(product) {
    PRODUCT_REQUIRED_PROPERTIES.forEach((requiredProperty) => {
      if (typeof product[requiredProperty] === "undefined") {
        throw new Error(
          `El producto debe tener la propiedad ${requiredProperty}.`
        );
      }
    });
  }
}

module.exports = ProductoDAO;
