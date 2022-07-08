const apiUtils = require("./apiUtils");

const productos = require("../controladores/productos");

class APIProductos {
  constructor() {
    /**
     * Hago el "bind" para que las funciones vean al "this" como este objeto
     * al ser llamadas desde el middleware.
     */
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  async getAll(req, res, next) {
    try {
      const result = await productos.getAll();
      res.send({ result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const id = Number.parseInt(req.params.id, 10);
      await this._throwErrorIfNotExists(id);
      const result = await productos.getById(id);
      res.send({ result });
    } catch (error) {
      next(error);
    }
  }

  async add(req, res, next) {
    try {
      if (!apiUtils.userIsAdmin(req)) {
        return apiUtils.throwNotAuthorizedError(req, res);
      }
      const result = await productos.save(req.body);
      res.send({ result });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      if (!apiUtils.userIsAdmin(req)) {
        return apiUtils.throwNotAuthorizedError(req, res);
      }
      const id = Number.parseInt(req.params.id, 10);
      await this._throwErrorIfNotExists(id);
      const result = await productos.update(id, req.body);
      res.send({ result });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req, res, next) {
    try {
      if (!apiUtils.userIsAdmin(req)) {
        return apiUtils.throwNotAuthorizedError(req, res);
      }
      const id = Number.parseInt(req.params.id, 10);
      await this._throwErrorIfNotExists(id);
      const result = await productos.deleteById(id);
      res.send({ result: true });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PRIVATE METHODS.
   */

  async _throwErrorIfNotExists(id) {
    try {
      const exists = await productos.exists(id);
      if (!exists) {
        console.error(`Producto ${id} no encontrado.`);
        throw new Error("producto no encontrado");
      }
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}

module.exports = new APIProductos();
