import { Router } from "express";
import {
  getProductsObjectController,
  getProductsController,
  getProductController,
  postProductController,
  putProductController,
  deleteProductController,
  updateProductController
} from "../controllers/products.controller.js";
import { adminAccess } from "../middleware/middleware.js";

const router = Router();

//Devuelve el objeto con la información pedida
router.get("/", getProductsObjectController);

//Vista de los productos
router.get("/products", getProductsController);

//Devuelve el producto con el pid especificado
router.get("/products/:pid", getProductController);

//Agrega un producto pasado por el body
router.post("/products", adminAccess, postProductController);

//Actualiza un producto pasado por el body
router.put("/:pid",adminAccess, putProductController);

//Elimina un producto por el pid pasado por params
router.delete("/:pid",adminAccess, deleteProductController);


export default router;
