const mongoModel = require("../orm/Usuario");

const bcrypt = require("bcrypt");

class UsuarioDAO {
  async exists(email) {
    try {
      const searched = await this.getByEmail(email);
      return searched !== null;
    } catch (error) {
      throw error;
    }
  }

  async save(newUser) {
    try {
      newUser.password = await this._hashPassword(newUser.password);
      const mongoNewUser = new mongoModel(newUser);
      const result = await mongoNewUser.save();
      return this.getById(result._id);
    } catch (error) {
      throw new Error(`Ha ocurrido un error agregando el contenido: ${error}`);
    }
  }

  async getById(id) {
    try {
      const searchedFound = await mongoModel.findOne({ _id: id }).lean();
      if (!searchedFound) {
        return null;
      }
      delete searchedFound.password;
      delete searchedFound.__v;
      return searchedFound;
    } catch (error) {
      throw error;
    }
  }

  async getByEmailAndPassword(email, password) {
    try {
      const searchedFound = await mongoModel.findOne({ email }).lean();
      if (!searchedFound) {
        return null;
      }
      const isValidPassword = await this._isValidPassword(
        password,
        searchedFound.password
      );
      if (isValidPassword) {
        return null;
      }
      delete searchedFound.password;
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

  async deleteByEmail(email) {
    try {
      await mongoModel.findOneAndDelete({ email });
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

  async _isValidPassword(plainPassword, hash) {
    return bcrypt.compare(plainPassword, hash);
  }

  async _hashPassword(plainPassword) {
    try {
      const salt = await this._generateSalt();
      const hash = bcrypt.hash(plainPassword, salt);
      return hash;
    } catch (error) {
      throw error;
    }
  }

  async _generateSalt() {
    return bcrypt.genSalt(10);
  }
}

module.exports = UsuarioDAO;
