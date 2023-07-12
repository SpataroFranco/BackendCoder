import Routers from "./router.js";
import {
  getProductsObjectController,
  getProductsController,
  getProductController,
  postProductController,
  putProductController,
  deleteProductController
} from "../controllers/products.controller.js";

import { adminAccess } from "../middleware/middleware.js";

export default class productsRouter extends Routers {
  init() {
    //Devuelve el objeto con la información pedida
    this.get("/", getProductsObjectController);

    //Vista de los productos
    this.get("/products", getProductsController);

    //Devuelve el producto con el pid especificado
    this.get("/products/:pid", getProductController);

    //Agrega un producto pasado por el body
    this.post("/products", adminAccess, postProductController);

    //Actualiza un producto pasado por el body
    this.put("/:pid", adminAccess, putProductController);

    //Elimina un producto por el pid pasado por params
    this.delete("/:pid", adminAccess, deleteProductController);
  }
}
