import Routers from "./router.js";
import { getChatsController } from "../controllers/chats.controller.js";

export default class chatsRouter extends Routers {
  init() {
    this.get("/", getChatsController);
  }
}
