const UsuarioDAO = require("../modelo/daos/usuarios");
const mails = require("../servicios/mails");

const usuarioDAO = new UsuarioDAO();

class UsuarioController {
  async exists(email) {
    return usuarioDAO.exists(email);
  }

  async save(newUser) {
    try {
      const savedUser = await usuarioDAO.save(newUser);
      await this._notifyNewUserByMail(savedUser);
      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    return usuarioDAO.getById(id);
  }

  async getByEmailAndPassword(email, password) {
    return usuarioDAO.getByEmailAndPassword(email, password);
  }

  async getAll() {
    return usuarioDAO.getAll();
  }

  async deleteByEmail(email) {
    return usuarioDAO.deleteByEmail(email);
  }

  async deleteAll() {
    return usuarioDAO.deleteAll();
  }

  /**
   *
   * PRIVATE
   *
   */

  async _notifyNewUserByMail(newUser) {
    let htmlTable = "";
    Object.keys(newUser).forEach((key) => {
      htmlTable += `<tr><td>${key}</td><td>${newUser[key]}</td></tr>`;
    });
    const htmlMessage = `<p>Se agregó un nuevo usuario: </p><p><table>${htmlTable}</table></p>`;
    await mails.sendToAdmin("Nuevo registro", htmlMessage);
  }
}

module.exports = new UsuarioController();
