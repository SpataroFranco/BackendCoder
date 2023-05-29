import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { createHash } from "../utils.js";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    res.send({ status: "succes", message: "User registered" });
  }
);

router.get("/failregister", async (req, res) => {
  console.log("Fallo en el registro");
  res.send({ error: "Error en el registro" });
});

router.post(
  "/",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", error: "Invalid credentials" });

    if (req.user.email === "adminCoder@coder.com") {
      req.session.user = {
        first_name: req.user.first_name + " " + req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: "admin",
      };
    } else {
      req.session.user = {
        first_name: req.user.first_name + " " + req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: "user",
      };
    }

    res.send({
      status: "success",
      payload: req.user,
      message: "Primer logueo!!",
    });
  }
);

router.get("/faillogin", async (req, res) => {
  console.log("Fallo en el ingreso");
  res.send({ error: "Error en el ingreso" });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(500)
        .send({ status: "error", error: "No pudo cerrar sesion" });
    res.redirect("/");
  });
});

router.post("/restartPassword", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Datos incorrectos" });

  const user = await userModel.findOne({ email });

  if (!user)
    return res
      .status(400)
      .send({ status: "error", error: "Datos incorrectos" });

  const newHashedPassword = createHash(password);

  await userModel.updateOne(
    { _id: user._id },
    { $set: { password: newHashedPassword } }
  );

  res.send({ status: "success", message: "Contraseña actualizada" });
});

router.get("/github", passport.authenticate("github"), async (req, res)=>{})

router.get("/githubcallback", passport.authenticate("github",{failureRedirect:"/"}), async (req, res)=>{
  req.session.user = req.user;
  res.redirect("/");
})

export default router;
