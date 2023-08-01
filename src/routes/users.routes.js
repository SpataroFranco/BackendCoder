import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { checkRole } from "../middleware/auth.js";

const router = Router();

router("/premium/:uid", checkRole(["admin"]), async (req, res) => {
  try {
    const userId = req.params.uid;

    const user = await userModel.findById(userId);

    const userRol = user.rol;

    if (userRol === "user") {
      user.rol = "premium";
    } else if (userRol === "premium") {
      user.rol = "user";
    } else {
      return res.json({
        status: "error",
        message: "No es posible cambiar el rol del usuario.",
      });
    }

    await userModel.updateOne({ _id: user._id }, user);

    return res.json({ status: "success", message: "Rol modificado." });
  } catch (error) {
    return res.json({
      status: "error",
      message: "Error al intentar cambiar el rol.",
    });
  }
});

export { router as usersRouter };
