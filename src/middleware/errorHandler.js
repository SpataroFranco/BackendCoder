import { Error } from "../enums/Error.js";

export const errorHandler = (error, req, res, next) => {
  switch (error.code) {
    case Error.INVALID_JSON:
      res.json({ status: "error", error: error.cause, message: error.message });
      break;
    case Error.DATABASE_ERROR:
      res.json({ status: "error", message: error.message });
      break;
    case Error.INVALID_PARAM:
      res.json({ status: "error", error: error.cause, message: error.message });
      break;
    case Error.AUTH_ERROR:
      res.json({ status: "error", error: error.cause, message: error.message });
      break;
    case Error.ROUTING_ERROR:
      res.json({ status: "error", error: error.cause, message: error.message });
      break;
    default:
        res.json({ status: "error", message: "Hubo un error, contacte al equipo de soporte." });
      break;
  }
  next();
};
