const CONFIG = require("./config");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

module.exports = session({
  store: MongoStore.create({
    mongoOptions,
    mongoUrl: CONFIG.MONGO_URL,
  }),
  secret: CONFIG.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // La sesión durará 1 día.
    path: "/",
    httpOnly: true,
    secure: false,
  },
});
