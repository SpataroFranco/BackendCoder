import { Router } from "express";
import ProductManager from "../dao/managers/ProductManager.js";

const router = Router();

const manager = new ProductManager();

const productos = await manager.getProducts();

router.get("/", async (req, res) => {
  const limit = req.query.limit;

  if (!limit || limit > productos.length) {
    return res.send({ productos });
  }
  let productosLimit = [];
  for (let index = 0; index < limit; index++) {
    productosLimit.push(productos[index]);
  }
  res.send({ productos });
});


router.get("/:pid", async (req, res) => {
  const pid = req.params.pid;

  let producto = await manager.getProductById(parseInt(pid));

  if (!producto) {
    return res.send({ error: "Producto no encontrado" });
  }
  res.send({ producto });
});

router.post("/", async (req, res) => {
  const prod = req.body;
  await manager.addProduct(prod);

  res.send({
    status: "Success",
    productos,
  });
});

router.put("/:pid", async (req, res) => {
  const pid = req.params.pid;

  const prod = req.body;

  let producto = await manager.getProductById(parseInt(pid));

  if (!producto) {
    return res.send({ error: "Producto no encontrado" });
  }

  await manager.updateProduct(
    parseInt(pid),
    prod.title,
    prod.description,
    prod.price,
    prod.status,
    prod.thumbnail,
    prod.code,
    prod.stock
  );

  res.send(prod);
});

router.delete("/:pid", async (req, res) => {
  const pid = req.params.pid;

  let producto = await manager.getProductById(parseInt(pid));

  if (!producto) {
    return res.send({ error: "Producto no encontrado" });
  }
  await manager.deleteProduct(parseInt(pid));

  res.send({
    status: "Success",
    message: "Producto borrado",
  });
});

export default router;
