import userModel from "../dao/models/user.model.js";

export const changeRolUser = async (req, res) => {
  try {
    const userId = req.params.uid;

    const user = await userModel.findById(userId);

    const userRol = user.rol;

    if (userRol === "user") {
      if(user.status === "completo"){
        user.rol = "premium";
      }else{
        return res.json({
          status: "error",
          message: "No es posible cambiar el rol del usuario, faltan cargar documentos",
        });
      }
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
};

export const updateUserDocument = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await userModel.findById(userId);
    const identificacion = req.files["identificacion"]?.[0] || null;
    const domicilio = req.files["domicilio"]?.[0] || null;
    const estadoDeCuenta = req.files["estadoDeCuenta"]?.[0] || null;
    const docs = [];

    if (identificacion) {
      docs.push({ name: "identificacion", reference: identificacion.filename });
    }
    if (domicilio) {
      docs.push({ name: "domicilio", reference: domicilio.filename });
    }
    if (estadoDeCuenta) {
      docs.push({ name: "estadoDeCuenta", reference: estadoDeCuenta.filename });
    }

    if(docs.length === 3){
      user.status = "completo"
    }else{
      user.status = "incompleto"
    }

    user.documents = docs;

   await userModel.findByIdAndUpdate(user._id, user);

    res.json({status:"success", message:"Documentos actualizados"})

  } catch (error) {
    console.log(error.message);
    res.json({
      status: "error",
      message: "Hubo un error al cargar los archivos",
    });
  }
};
