// import { Router } from "express";
import Routers from "./router.js";
import {
  postRegisterUserController,
  getFailRegisterController,
  postSessionController,
  getFailLoginController,
  getLogoutController,
  postRestartPasswordController,
  getGithubCallbackController,
  getGithubController
} from "../controllers/sessions.controller.js";
import { uploaderProfile } from "../utils.js";

export default class viewsRouter extends Routers {

  init() {
    this.post("/register",uploaderProfile.single("avatar") ,postRegisterUserController);

    this.get("/failregister", getFailRegisterController);
    
    this.post("/", postSessionController);
    
    this.get("/faillogin", getFailLoginController);
    
    this.get("/logout", getLogoutController);
    
    this.post("/restartPassword", postRestartPasswordController);
    
    this.get("/github", getGithubController);
    
    this.get("/githubcallback", getGithubCallbackController);

  }
}