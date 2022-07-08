const CarritoDAO = require("../modelo/daos/carritos");
const CONFIG = require("../config");
const productosController = require("./productos");
const usuariosController = require("./usuarios");
const mails = require("../servicios/mails");
const twilio = require("../servicios/twilio");

const carritoDAO = new CarritoDAO();

class CarritoControlador {
  async getByUserId(userId) {
    return carritoDAO.getByUserId(userId);
  }

  async addToCart(userId, productId, count) {
    try {
      const productStock = await this._getProductCountFromCart(productId);
      if (productStock < count) {
        throw new Error(
          `No hay stock suficiente del producto ${thisProduct.nombre}.`
        );
      }
      const newStock = productStock - count;
      const userProductsCount = await this._getUserProductCount(
        userId,
        productId
      );
      await carritoDAO.setProductCountByUserAndProductId(
        userId,
        productId,
        userProductsCount + count
      );
      await productosController.update(productId, { stock: newStock });
      return this.getByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  async removeFromCart(userId, productId, count) {
    try {
      const userProductsCount = await this._getUserProductCount(
        userId,
        productId
      );
      const extractedCount =
        userProductsCount > count ? count : userProductsCount;
      const newUsersProductCount = userProductsCount - extractedCount;
      const productStock = await this._getProductCountFromCart(productId);
      const newStock = productStock + extractedCount;
      await carritoDAO.setProductCountByUserAndProductId(
        userId,
        productId,
        newUsersProductCount
      );
      await productosController.update(productId, { stock: newStock });
      return this.getByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  async buy(userId) {
    try {
      const usuario = await usuariosController.getById(userId);
      const carrito = await carritoDAO.getByUserId(userId);
      await this._notifyCarritoByMail(carrito);
      await twilio.sendWhatsapp(
        CONFIG.ADMIN_NUMBER,
        `Se compraron ${carrito.productos.length} productos.`
      );
      await twilio.sendSMS(
        CONFIG.ADMIN_NUMBER,
        `El pedido de ${carrito.productos.length} productos ya está en proceso.`
      );
      await twilio.sendSMS(
        usuario.telefono,
        `El pedido de ${carrito.productos.length} productos ya está en proceso.`
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async emptyByUserId(userId) {
    return carritoDAO.emptyByUserId(userId);
  }

  /**
   *
   * PRIVATE
   *
   */

  async _getProductCountFromCart(productId) {
    try {
      const products = await productosController.getAll();
      const thisProduct = products.find((e) => e._id.toString() === productId);
      if (!thisProduct) {
        throw new Error(`No se pudo encontrar el producto ${productId}.`);
      }
      return thisProduct.stock;
    } catch (error) {
      throw error;
    }
  }

  async _getUserProductCount(userId, productId) {
    try {
      const userCarrito = await this.getByUserId(userId);
      const thisProduct = userCarrito.productos.find(
        (e) => e.producto._id.toString() === productId
      );
      if (!thisProduct) {
        return 0;
      }
      return thisProduct.cantidad;
    } catch (error) {
      throw error;
    }
  }

  async _notifyCarritoByMail(carrito) {
    let htmlTable = "<table>";
    carrito.productos.forEach((tmpProducto) => {
      htmlTable += `<tr><td>${tmpProducto.producto.nombre}</td><td>${tmpProducto.producto.cantidad}</td></tr>`;
    });
    htmlTable += "</table>";
    const htmlMessage = `<p>Se realizó una compra: </p><p>${htmlTable}</p>`;
    await mails.sendToAdmin("Nueva compra", htmlMessage);
  }
}

module.exports = new CarritoControlador();
