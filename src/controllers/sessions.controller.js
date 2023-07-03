import passport from "passport";
// import userModel from "../dao/models/user.model.js";
import { createHash } from "../utils.js";
import { userService } from "../repository/index.js";

export const postRegisterUserController = async (req, res) => {
  passport.authenticate("register", { failureRedirect: "/failregister" })(
    req,
    res,
    async () => {
      res.send({ status: "success", message: "User registered" });
    }
  );
};

export const getFailRegisterController = async (req, res) => {
  console.log("Fallo en el registro");
  res.send({ error: "Error en el registro" });
};

export const postSessionController = async (req, res) => {
  passport.authenticate("login", { failureRedirect: "/faillogin" })(
    req,
    res,
    async () => {
      if (!req.user)
        return res
          .status(400)
          .send({ status: "error", error: "Invalid credentials" });

      req.session.user = {
        first_name: req.user.first_name + " " + req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol,
        cart: req.user.cart,
      };

      res.send({
        status: "success",
        payload: req.user,
        message: "Primer logueo!!",
      });
    }
  );
};

export const getFailLoginController = async (req, res) => {
  console.log("Fallo en el ingreso");
  res.send({ error: "Error en el ingreso" });
};

export const getLogoutController = async (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(500)
        .send({ status: "error", error: "No pudo cerrar sesion" });
    res.redirect("/");
  });
};

export const postRestartPasswordController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Datos incorrectos" });

  // const user = await userModel.findOne({ email });
  const user = await userService.getUser({email})

  if (!user)
    return res
      .status(400)
      .send({ status: "error", error: "Datos incorrectos" });

  const newHashedPassword = createHash(password);

  // await userModel.updateOne(
  //   { _id: user._id },
  //   { $set: { password: newHashedPassword } }
  // );
  await userService.updatePassword(user, newHashedPassword);

  res.send({ status: "success", message: "Contraseña actualizada" });
};

export const getGithubCallbackController = async (req, res) => {
  passport.authenticate("github", { failureRedirect: "/" })(
    req,
    res,
    async () => {
      req.session.user = req.user;
      res.redirect("/");
    }
  );
};

export const getGithubController = async (req, res) => {
  res.redirect("/github");
};
