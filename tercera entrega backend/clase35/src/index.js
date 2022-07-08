const cluster = require("node:cluster");
const cookieParser = require("cookie-parser");
const express = require("express");
const expressSession = require("express-session");
const handlebars = require("express-handlebars");
const http = require("http");
const multer = require("multer");
const { cpus } = require("node:os");
const path = require("path");
const process = require("node:process");

const CONFIG = require("./config.js");
const apiUsuarios = require("./api/usuarios");
const mongo = require("./modelo/db/mongo");
const passport = require("./passport");
const sessions = require("./sessions");
const carritosController = require("./controladores/carritos");
const productosController = require("./controladores/productos");
const usuariosController = require("./controladores/usuarios");
const routerCarritos = require("./routers/carritos");
const routerProductos = require("./routers/productos");
require("./loggings");

const app = express();
const server = http.Server(app);
const numCPUs = cpus().length;

const TEMPLATER_ENGINE = "hbs";
const PORT = process.env.PORT || 8080;
const PUBLIC_PATH = path.join(__dirname, "public");
const VIEWS_PATH = path.join(__dirname, "./views", TEMPLATER_ENGINE);
const LAYOUTS_PATH = path.join(VIEWS_PATH, "layouts");
const PARTIALS_PATH = path.join(VIEWS_PATH, "layouts");

const uploads = multer({ dest: path.join(__dirname, "public") });

/**
 * CONFIGURACIÓN DE VISTAS (handlebars).
 */
app.set(`views`, VIEWS_PATH);
app.set(`view engine`, TEMPLATER_ENGINE);
if (TEMPLATER_ENGINE === "hbs") {
  app.engine(
    `hbs`,
    handlebars.engine({
      extname: ".hbs",
      layoutsDir: LAYOUTS_PATH,
      partialsDir: PARTIALS_PATH,
    })
  );
}

/**
 * SERVIDO DE ARCHIVOS PÚBLICOS.
 */
app.use("/public", express.static(PUBLIC_PATH));

/**
 * CONTROL DE SESIÓN.
 */
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(sessions);
app.use(passport.initialize());
app.use(passport.session());
app.get("/register", (req, res) => res.render("register"));
app.post("/register", uploads.single("foto"), apiUsuarios.handleRegister);
app.get("/login", (req, res) => res.render("login"));
app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login-error" }),
  function (req, res) {
    res.redirect("/carrito");
  }
);
app.get("/logout", apiUsuarios.handleLogout);
app.get("/login", (req, res) => res.render("login"));
app.get("*", apiUsuarios.forceLogin);
app.use((error, req, res, next) => {
  const errorMessage = error.message;
  res.render("error", { errorMessage });
});

/**
 * APIS
 */
app.use("/api/productos", routerProductos);
app.use("/api/carritos", routerCarritos);
app.use((error, req, res, next) => {
  console.error(error.message);
  res.send({ error: error.message });
});

/**
 * VISTAS
 */

app.get("/carrito", async (req, res) => {
  const userId = req.user;
  const carrito = await carritosController.getByUserId(userId);
  const { productos } = carrito;
  const hayProductos = productos.length > 0;
  res.render("carrito", { productos, hayProductos });
});

app.get("/usuario", async (req, res) => {
  const usuario = await usuariosController.getById(req.user);
  res.render("usuario", { usuario });
});

app.get("*", async (req, res) => {
  let productos = await productosController.getAll();
  productos = productos.map((e) => {
    return {
      hayStock: e.stock > 0,
      ...e,
    };
  });
  res.render("productos", { productos });
});

/**
 * INICIO DE SERVIDOR.
 */
async function startServer() {
  try {
    await mongo.connect();
    const listeningServer = server.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
    listeningServer.on(`error`, (error) =>
      console.log(`Este es el error ${error}`)
    );
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

if (CONFIG.USE_CLUSTER) {
  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    startServer();
    console.log(`Worker ${process.pid} started`);
  }
} else {
  startServer();
}
