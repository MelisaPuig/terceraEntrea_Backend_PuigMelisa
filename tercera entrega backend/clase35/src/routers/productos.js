const express = require("express");

const apiProductos = require("../api/productos");
const apiUtils = require("../api/apiUtils");
const router = express.Router();

router.use(express.json());
router.get("/", apiProductos.getAll);
router.get("/:id", apiProductos.getById);
router.post("/", apiProductos.add);
router.put("/:id", apiProductos.update);
router.delete("/:id", apiProductos.deleteById);

router.all("*", (req, res) => apiUtils.throwMethodNotFoundError(req, res));

router.use((error, req, res, next) => {
  console.error(error.message);
  res.send({ error: error.message });
});

module.exports = router;
