class APIUtils {
  userIsAdmin(req) {
    // TODO: AGREGAR ACA
    return true;
  }

  throwNotAuthorizedError(req, res) {
    const route = req.originalUrl;
    const method = req.method;
    const error = -1;
    const descripcion = `ruta '${route}' método '${method}' no autorizada`;
    res.status = 403;
    console.error(descripcion);
    res.send({ error, descripcion });
  }

  throwMethodNotFoundError(req, res) {
    const route = req.originalUrl;
    const method = req.method;
    const error = -2;
    const descripcion = `ruta '${route}' método '${method}' no implementada`;
    res.status = 404;
    console.error(descripcion);
    res.send({ error, descripcion });
  }
}

module.exports = new APIUtils();
