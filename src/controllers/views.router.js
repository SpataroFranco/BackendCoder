import productoModel from "../dao/models/products.model.js";
import userModel from "../dao/models/user.model.js";

export const publicAcces = (req, res, next) => {
  if (req.session.user) return res.redirect("/profile/products");
  next();
};

export const privateAcces = (req, res, next) => {
  if (!req.session.user) return res.redirect("/");
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

  res.render("current", {
    user: req.session.user,
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

    const user = await userModel.findOne({ email: uemail });

    if (user) {
      user.cart = carritoNuevo;

      await userModel.updateOne({ email: uemail }, { $set: user });

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
