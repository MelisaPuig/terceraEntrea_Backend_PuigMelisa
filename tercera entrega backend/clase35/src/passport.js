require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const usuarios = require("./controladores/usuarios");

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await usuarios.getByEmailAndPassword(username, password);
      if (user === null) {
        console.error(`Error logueando a ${username}`);
        throw new Error("Usuario o password inválidos.");
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const dbUser = await usuarios.getById(id);
    return done(null, dbUser);
  } catch (error) {
    return done(error, null);
  }
});

module.exports = passport;
