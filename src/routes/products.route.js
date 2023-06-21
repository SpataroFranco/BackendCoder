import { Router } from "express";
import {
  getProductsObjectController,
  getProductsController,
  getProductController,
  postProductController,
  putProductController,
  deleteProductController,
} from "../controllers/products.controller.js";

const router = Router();

//Devuelve el objeto con la información pedida
router.get("/", getProductsObjectController);

//Vista de los productos
router.get("/products", getProductsController);

//Devuelve el producto con el pid especificado
router.get("/products/:pid", getProductController);

//Agrega un producto pasado por el body
router.post("/products", postProductController);

//Actualiza un producto pasado por el body
router.put("/:pid", putProductController);

//Elimina un producto por el pid pasado por params
router.delete("/:pid", deleteProductController);

export default router;
