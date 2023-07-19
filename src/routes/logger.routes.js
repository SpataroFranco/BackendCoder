import { Router } from "express";

const loggerRoute = Router();

loggerRoute.get("/", (req, res) => {
  req.logger.warn("!Alerta!");
  req.logger.info("Info");
  req.logger.error("Error");
  req.logger.debug("Debug");
  req.logger.silly("Silly");
  req.logger.verbose("Verbose");
  req.logger.http("Http");
  req.logger.fatal("Fatal");

  res.send("Prueba de logger");
});

export default loggerRoute;
