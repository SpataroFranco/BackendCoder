import Routers from "./router.js";
import {
  getCartsController,
  postCartController,
  getCartController,
  putProductsToCartController,
  putCartController,
  deleteProductToCartController,
  deleteProductsToCartController,
  purchaseController,
  finishCart,
  addProductInCart

} from "../controllers/carts.controller.js";
import {checkRole} from "../middleware/auth.js";

export default class cartsRouter extends Routers {
  init() {
    //Devuelve todos los carritos
    this.get("/", getCartsController);

    //Crea un carrito nuevo
    this.post("/", postCartController);

    //Vista para ver cart específico
    this.get("/:cid", getCartController);     

    //Vista para ver el carrito final y finalizar la compra
    this.get("/:cid/purchase", finishCart)

    //Actualiza el carrito con un arreglo de productos
    this.put("/:cid",checkRole(["user","premium"]), putCartController);

    //Agrega un producto al carrito y si ya existe le suma la cantidad en +1
    this.post("/:cid/products/:pid", addProductInCart);

    //Elimina del carrito el producto seleccionado
    this.delete("/:cid/products/:pid", deleteProductToCartController);

    //Elimina todos los productos del carrito
    this.delete("/:cid", deleteProductsToCartController);

    this.post("/:cid/purchase", purchaseController)

  }
}
