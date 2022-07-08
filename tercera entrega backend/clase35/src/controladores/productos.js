const ProductoDAO = require("../modelo/daos/productos");

const productoDAO = new ProductoDAO();

class ProductoController {
  async exists(id) {
    return productoDAO.exists(id);
  }

  async save(newProduct) {
    return productoDAO.save(newProduct);
  }

  async getById(id) {
    return productoDAO.getById(id);
  }

  async getAll() {
    return productoDAO.getAll();
  }

  async update(id, productData) {
    return productoDAO.update(id, productData);
  }

  async deleteById(id) {
    return productoDAO.deleteById(id);
  }

  async deleteAll() {
    return productoDAO.deleteAll();
  }
}

module.exports = new ProductoController();
