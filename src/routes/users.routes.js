import Routers from "./router.js";
import { checkRole, checkAuthenticated } from "../middleware/auth.js";
import {
  changeRolUser,
  deleteUser,
  updateUserDocument,
  getUsers,
  deleteAllUsersInactive
} from "../controllers/users.controller.js";
import { uploaderDocument } from "../utils.js";

export default class usersRouter extends Routers {
  init() {
    //Devuelve el objeto con la información pedida
    this.put("/premium/:uid", checkRole(["admin"]), changeRolUser);

    this.delete("/premium/:uid", checkRole(["admin"]), deleteUser);

    this.delete("/", checkRole(["admin"]), deleteAllUsersInactive)

    this.put(
      "/:uid/documents",
      checkAuthenticated,
      uploaderDocument.fields([
        { name: "identificacion", maxCount: 1 },
        { name: "domicilio", maxCount: 1 },
        { name: "estadoDeCuenta", maxCount: 1 },
      ]),
      updateUserDocument
    );

    this.get("/", checkRole(["admin"]), getUsers);
  }
}
