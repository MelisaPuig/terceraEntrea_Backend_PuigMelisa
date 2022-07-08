const express = require("express");

const apiCarritos = require("../api/carritos");
const apiUtils = require("../api/apiUtils");
const router = express.Router();

router.use(express.json());
router.post("/add", apiCarritos.add);
router.post("/remove", apiCarritos.remove);
router.post("/buy", apiCarritos.buy);

router.all("*", (req, res) => apiUtils.throwMethodNotFoundError(req, res));

router.use((error, req, res, next) => {
  console.error(error.message);
  res.send({ error: error.message });
});

module.exports = router;
