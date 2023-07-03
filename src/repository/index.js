import {UserRepository} from "./user.repository.js";
import UserManager from "../dao/managers/userManager.js";

const userDao = new UserManager();

export const userService = new UserRepository(userDao);

