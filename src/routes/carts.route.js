import { Router } from "express";
import cartModel from "../dao/models/carts.model.js";

const router = Router();

router.get("/", async (req, res) => {
  const result = await cartModel.find();

  res.send({ Carritos: result });
});

router.post("/", async (req, res) => {
  const carrito = req.body;

  await cartModel.create(carrito);

  res.send({
    status: "Success",
    carrito,
  });
});

//Vista para ver cart específico
router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartModel
    .findById(cid)
    .populate("products.product")
    .lean();
    
  if (cart.products.length > 0) {
    return res.render("cart", {cart});
  }
  
});

//Actualiza la cantidad de unidades del producto en el carrito por la cantidad pasada por req.body
router.put("/:cid/products/:pid", async (req, res) => {
  const cantidad = req.body;
  const cid = req.params.cid;
  const pid = req.params.pid;

  const cart = await cartModel.findOne({ _id: cid });

  const prodIndex = cart.products.findIndex((cprod) => cprod.product == pid);

  const quantity = cantidad.cantidad;
  parseInt(quantity);

  if (prodIndex === -1) {
    const product = {
      product: pid,
      quantity: quantity,
    };
    cart.products.push(product);
  } else {
    let total = cart.products[prodIndex].quantity;
    cart.products[prodIndex].quantity = total + quantity;
  }

  await cartModel.updateOne({ _id: cid }, { $set: cart });

  res.send({ res: cart.products });
});

//Actualiza el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  //???????????
});

//Elimina del carrito el producto seleccionado
router.delete("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  const cart = await cartModel.findOne({ _id: cid });

  const prodIndex = cart.products.findIndex((cprod) => cprod.product == pid);

  if (prodIndex === -1) {
    return res.send({
      code: 404,
      status: "Error",
      message: "El producto no existe en el carrito",
    });
  } else {
    cart.products.splice(prodIndex, 1);
    await cartModel.updateOne({ _id: cid }, { $set: cart });

    res.send({ code: 202, status: "Success", message: cart.products });
  }
});

//Elimina todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;

  const cart = await cartModel.findOne({ _id: cid });

  cart.products.splice(0, cart.products.length);

  await cartModel.updateOne({ _id: cid }, { $set: cart });

  res.send({ code: 202, status: "Success", message: cart.products });
});

export default router;
