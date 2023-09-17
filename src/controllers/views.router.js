import productoModel from "../dao/models/products.model.js";
import userModel from "../dao/models/user.model.js";
import { userService } from "../repository/index.js";
import { CreateUserDto } from "../dao/dto/user.dto.js";
import { CustomError } from "../services/customError.service.js";
import { Error } from "../enums/Error.js";
import { generateUserErrorParam } from "../services/userErrorParam.js";
import { generateUserErrorInfo } from "../services/userErrorInfo.js";
import { sendRecoveryPass } from "../config/gmail.js";
import { verify } from "jsonwebtoken";
import {
  createHash,
  isValidPassword,
  generateEmailToken,
  verifyEmailToken,
} from "../utils.js";
import cartModel from "../dao/models/carts.model.js";

export const publicAcces = (req, res, next) => {
  if (req.session.user) return res.redirect("/profile/products");
  next();
};

export const privateAcces = (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });
  next();
};

export const getViewsRegisterController = async (req, res) => {
  res.render("register");
};

export const getViewsLoginController = async (req, res) => {
  res.render("login");
};

export const getViewsProfileController = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;

  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs } =
    await productoModel.paginate({}, { limit: limit, page, lean: true });
  const products = docs;

  const cartUser = await userModel
    .findOne({ email: req.session.user.email })
    .populate("cart.cart")
    .lean();

  // const cartUser = await userService.getCart({ email: req.session.user.email });

  res.render("products", {
    user: req.session.user,
    cartUser,
    products,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    totalDocs,
    limit,
  });
};

export const getViewsCurrentController = async (req, res) => {
  const cartUser = await userModel
  .findOne({ email: req.session.user.email })
  .populate("cart.cart")
  .lean();
  let { first_name, last_name, email, age, rol } = req.session.user;
  // if (!first_name || !last_name || !email) {
  //   CustomError.createError({
  //     name: "User login error",
  //     cause: generateUserErrorInfo(req.session.user),
  //     message: "Error cargando al usuario",
  //     errorCode: Error.INVALID_JSON,
  //   });
  // }
  let user = new CreateUserDto({ first_name, last_name, email, age, rol });

  // const cartUser = await userService.getCart();

  res.render("current", {
    user,
    cartUser,
  });
};

export const getViewsResetPasswordController = async (req, res) => {
  res.render("resetPassword");
};

export const putUserController = async (req, res) => {
  const uemail = req.params.uemail;

  try {
    const carritoNuevo = req.body;

    const user = await userService.getUser({ email: uemail });

    if (user) {
      user.cart = carritoNuevo;

      await userService.updateUser(uemail, user);

      res.send({ code: 202, status: "Success", message: user.cart });
    }
  } catch (error) {
    return res.send({
      code: 404,
      status: "Error",
      message: "El usuario con el email: " + uemail + " no existe",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.getUser({ email });

    if (!user) {
      return res.send(
        `<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`
      );
    }
    const token = generateEmailToken(email, 3 * 60);

    await sendRecoveryPass(email, token);

    res.send(
      "Se envio un correo a su cuenta para restablecer la contraseña, volver al<a href='/login'> login</a>"
    );
  } catch (error) {
    return res.send(
      `<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`
    );
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const { email, newPassword } = req.body;

    const validEmail = verifyEmailToken(token);
    if (!validEmail) {
      return res.send(
        "El enlace ya no es valido, genere uno nuevo: <a href='/forgot-password> Nuevo enlace </a>"
      );
    }

    const user = await userService.getUser({ email });

    if (!user) {
      return res.send("El usuario no esta registrado.");
    }

    if (isValidPassword(newPassword, user)) {
      return res.send("No puedes usar la misma contraseña.");
    }

    const newHashedPassword = createHash(newPassword);

    await userService.updatePassword(user, newHashedPassword);

    res.render("login", { message: "contraseña actualizada" });
  } catch (error) {
    res.send(error.message);
  }
};
