import Routers from "./router.js";
import {
  publicAcces,
  privateAcces,
  getViewsRegisterController,
  getViewsLoginController,
  getViewsProfileController,
  getViewsCurrentController,
  getViewsResetPasswordController,
  putUserController,
} from "../controllers/views.router.js";

export default class viewsRouter extends Routers {
  init() {
    this.get("/register", publicAcces, getViewsRegisterController);

    this.get("/", publicAcces, getViewsLoginController);

    this.get("/profile/products", privateAcces, getViewsProfileController);

    this.get("/profile/current", privateAcces, getViewsCurrentController);

    this.get("/resetPassword", publicAcces, getViewsResetPasswordController);

    //Actualiza el usuario con un arreglo de carritos
    this.put("/:uemail", publicAcces, putUserController);
  }
}
