import Routers from "./router.js";
import {
  getCartsController,
  postCartController,
  getCartController,
  putProductsToCartController,
  putCartController,
  deleteProductToCartController,
  deleteProductsToCartController,
  finishBuy,
} from "../controllers/carts.controller.js";

export default class cartsRouter extends Routers {
  init() {
    //Devuelve todos los carritos
    this.get("/", getCartsController);

    //Crea un carrito nuevo
    this.post("/", postCartController);

    //Vista para ver cart específico
    this.get("/:cid", getCartController);

    //Actualiza la cantidad de unidades del producto en el carrito por la cantidad pasada por req.body
    this.put("/:cid/products/:pid", putProductsToCartController);

    //Actualiza el carrito con un arreglo de productos
    this.put("/:cid", putCartController);

    //Elimina del carrito el producto seleccionado
    this.delete("/:cid/products/:pid", deleteProductToCartController);

    //Elimina todos los productos del carrito
    this.delete("/:cid", deleteProductsToCartController);

    //Finaliza la compra
    this.get("/:cid/purchase", finishBuy);
  }
}
