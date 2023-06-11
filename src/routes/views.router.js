import Routers from "./router.js";
import productoModel from "../dao/models/products.model.js";
import userModel from "../dao/models/user.model.js";

export default class viewsRouter extends Routers {
  init() {
    const publicAcces = (req, res, next) => {
      if (req.session.user) return res.redirect("/profile/products");
      next();
    };

    const privateAcces = (req, res, next) => {
      if (!req.session.user) return res.redirect("/");
      next();
    };

    this.get("/register", publicAcces, (req, res) => {
      res.render("register");
    });

    this.get("/", publicAcces, (req, res) => {
      res.render("login");
    });

    this.get("/profile/products", privateAcces, async (req, res) => {
      const { limit = 10, page = 1 } = req.query;

      const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs } =
        await productoModel.paginate({}, { limit: limit, page, lean: true });
      const products = docs;

      const cartUser = await userModel.findOne({ email: req.session.user.email }).populate("cart.cart").lean();

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
    });

    this.get("/resetPassword", publicAcces, (req, res) => {
      res.render("resetPassword");
    });

    //Actualiza el usuario con un arreglo de carritos
    this.put("/:uemail", publicAcces, async (req, res) => {
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
    });
  }
}
