import { Router } from "express";
import CarritoManager from "../CarritoManager.js";
import ProductManager from "../ProductManager.js";

const router = Router();
const carritoManager = new CarritoManager();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
  const carrito = req.body;
  await carritoManager.addCart(carrito);

  res.send({
    status: "Success",
    carrito,
  });
});

router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;

  let carrito = await carritoManager.getCartById(parseInt(cid));

  if (!carrito) {
    return res.send({ error: "Carrito no encontrado" });
  }
  res.send({ status: "Success", "productos del carrito": carrito.products });
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const producto = await productManager.getProductById(parseInt(pid));
    const carrito = await carritoManager.getCartById(parseInt(cid));

    await carritoManager.addProductToCart(carrito.id, producto)

    res.send({status:"Success", "cart":carrito})
})

export default router;
