import Routers from "./router.js";
import {
  mockingProductsController
} from "../controllers/products.controller.js";

export default class mockingsRouter extends Routers {
  init() {
    //Devuelve los productos creados en el mocking
    this.get("/", mockingProductsController);
  }
}
