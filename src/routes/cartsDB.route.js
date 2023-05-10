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

router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;

  try {
    const result = await cartModel.find({ _id: cid });

    if (result.length > 0) {
      return res.status(200).send({ status: "sucess", result });
    }
  } catch (error) {
    res.status(400).send({
      status: "error",
      error: "El carrito con id: " + cid + " no existe",
    });
  }
});


router.post("/:cid/producto/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  const cart = await cartModel.findOne({ _id: cid });
  const prodIndex = cart.products.findIndex((cprod) => cprod.product == pid);
  
  if (prodIndex === -1) {
    const product = {
      product: pid,
      quantity: 1,
    };
    cart.products.push(product);
  } else {
    let total = cart.products[prodIndex].quantity;
    cart.products[prodIndex].quantity = total + 1;
  }

 await cartModel.updateOne({ _id: cid }, { $set: cart });

  res.send({res: cart.products})
});

export default router;
