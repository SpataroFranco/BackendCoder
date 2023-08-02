import Routers from "./router.js";
import { getChatsController } from "../controllers/chats.controller.js";
import {checkRole} from "../middleware/auth.js";

export default class chatsRouter extends Routers {
  init() {
    this.get("/", checkRole(["user"]), getChatsController);
  }
}
