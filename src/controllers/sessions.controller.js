import passport from "passport";
import { createHash, isValidPassword, generateEmailToken, verifyEmailToken } from "../utils.js";
import { userService } from "../repository/index.js";
import {sendRecoveryPass} from "../config/gmail.js";
import { verify } from "jsonwebtoken";


export const postRegisterUserController = async (req, res) => {
  try {
    passport.authenticate("register", { failureRedirect: "/failregister" })(
      req,
      res,
      async () => {
        res.send({ status: "success", message: "User registered" });
      }
    );
    req.logger.info("Usuario registrado");
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al procesar la solicitud",
    });
  }
};

export const getFailRegisterController = async (req, res) => {
  req.logger.warn("Fallo al registrarse");
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

      req.logger.info("Usuario logueado")
      res.send({
        status: "success",
        payload: req.user,
        message: "Primer logueo!!",
      });
    }
  );
};

export const getFailLoginController = async (req, res) => {
  req.logger.warn("Fallo en el ingreso");
  res.send({ error: "Error en el ingreso" });
};

export const getLogoutController = async (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(500)
        .send({ status: "error", error: "No pudo cerrar sesion" });
    res.redirect("/");
    req.logger.info("Usuario desconectado");
  });
};

export const postRestartPasswordController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Datos incorrectos" });

  const user = await userService.getUser({ email });

  if (!user)
    return res
      .status(400)
      .send({ status: "error", error: "Datos incorrectos" });

  const newHashedPassword = createHash(password);

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


export const forgotPassword = async (req , res) => {
  try {
    const {email} = req.body;
    const user = await userService.getUser({email})

    if(!user){
      return res.send(`<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`)
    }
    const token = generateEmailToken(email, 3*60);

    await sendRecoveryPass(email, token);

    res.send("Se envio un correo a su cuenta para restablecer la contraseña, volver al<a href='/login'> login</a>");

  } catch (error) {
    return res.send(`<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`)
  }
}

export const resetPassword = async (req , res) => {
  try {
    const token = req.query.token;
    const {email, newPassword} = req.body;

    const validEmail = verifyEmailToken(token);
    if(!validEmail){
      return res.send("El enlace ya no es valido, genere uno nuevo: <a href='/forgot-password> Nuevo enlace </a>")
    }

    const user = await userService.getUser({email})

    if(!user){
      return res.send("El usuario no esta registrado.")
    }

    if(isValidPassword(newPassword, user)){
      return res.send("No puedes usar la misma contraseña.")
    }

    const newHashedPassword = createHash(newPassword);

    await userService.updatePassword(user, newHashedPassword);

    res.render("login", {message:"contraseña actualizada"})

  } catch (error) {
    res.send(error.message)
  }
}