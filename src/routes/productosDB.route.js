import { Router } from "express";
import productoModel from "../dao/models/productos.model.js";

const router = Router();

router.get("/", async (req, res) => {
  const limit = req.query.limit;

  const result = await productoModel.find().limit(parseInt(limit));

  res.send({ Productos: result });
});

router.get("/:pid", async (req, res) => {
  const pid = req.params.pid;

  try {
    const result = await productoModel.find({ _id: pid });

    if (result.length > 0) {
      return res.status(200).send({ status: "sucess", result });
    }
  } catch (error) {
    res.status(400).send({
      status: "error",
      error: "El producto con id: " + pid + " no existe",
    });
  }
});

router.post("/", async (req, res) => {
  const { title, description, price, status, thumbnail, code, stock } =
    req.body;

  const producto = {
    title,
    description,
    price,
    status,
    thumbnail,
    code,
    stock,
  };

  const result = await productoModel.create(producto);

  res.send({ result });
});

router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const updateProducto = req.body;

  try {
    const result = await productoModel.updateOne(
      { _id: id },
      { $set: updateProducto }
    );
    res.send({ result });
  } catch (error) {
    return res.send({ error: "id no encontrado" });
  }

  
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    await productoModel.deleteOne({ _id: id });

    res.send({
      status: "Success",
      message: "Producto borrado",
    });

  } catch (error) {
    return res.send({ error: "Producto no encontrado" });
  }
});

export default router;
