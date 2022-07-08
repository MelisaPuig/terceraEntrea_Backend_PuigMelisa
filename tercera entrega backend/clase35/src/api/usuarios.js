const fs = require("fs");
const path = require("path");

const usuarios = require("../controladores/usuarios");

class User {
  constructor() {
    this.handleRegister = this.handleRegister.bind(this);
    this.forceLogin = this.forceLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleRegister(req, res, next) {
    let photoPath = "";
    try {
      const photo = req.file;
      photoPath = photo.path;
      const newUser = await usuarios.save(req.body);
      await this._savePhoto(newUser._id, photo);
      res.redirect(302, "/login");
    } catch (error) {
      if (photoPath !== "") {
        fs.unlinkSync(photoPath);
      }
      next(error);
    }
  }

  forceLogin(req, res, next) {
    try {
      if (!req.user) {
        return res.redirect(302, "/login");
      }
      if (!req.user.nombre) {
        return res.redirect(302, "/login");
      }
      if (req.user.nombre === "") {
        return res.redirect(302, "/login");
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  async handleLogout(req, res, next) {
    try {
      if (!req.user) {
        return res.redirect(302, "/login");
      }
      const nombre = req.user.nombre;
      if (!nombre) {
        return res.redirect(302, "/login");
      }
      req.logout(() => {
        req.session.destroy();
        res.render("logout", { nombre });
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *  PRIVATE METHODS.
   */

  async _savePhoto(userId, photo) {
    const currentPath = photo.path;
    const imageName = `${userId}.png`;
    const newPath = path.join(
      __dirname,
      "..",
      "public",
      "imgs",
      "usuarios",
      imageName
    );
    fs.copyFileSync(currentPath, newPath);
    fs.unlinkSync(currentPath);
  }
}

module.exports = new User();
