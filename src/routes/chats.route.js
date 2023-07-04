import Routers from "./router.js";
import { getChatsController } from "../controllers/chats.controller.js";
import { userAccess } from "../middleware/middleware.js";

export default class chatsRouter extends Routers {
  init() {
    this.get("/", userAccess, getChatsController);
  }
}
