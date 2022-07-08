const apiUtils = require("./apiUtils");

const carritos = require("../controladores/carritos");

class APICarritos {
  constructor() {}

  async add(req, res, next) {
    try {
      const userId = req.user;
      const { productId, count } = req.body;
      const result = await carritos.addToCart(userId, productId, count);
      res.send({ result });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const userId = req.user;
      const { productId, count } = req.body;
      const result = await carritos.removeFromCart(userId, productId, count);
      res.send({ result });
    } catch (error) {
      next(error);
    }
  }

  async buy(req, res, next) {
    try {
      const userId = req.user;
      const result = await carritos.buy(userId);
      res.send({ result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PRIVATE METHODS.
   */
}

module.exports = new APICarritos();
