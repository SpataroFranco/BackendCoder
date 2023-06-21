import cartModel from "../dao/models/carts.model.js";

export const getCartsController = async (req, res) => {
  const result = await cartModel.find();
  res.send({ Carritos: result });
};

export const postCartController = async (req, res) => {
  const carrito = req.body;

  await cartModel.create(carrito);

  res.send({
    status: "Success",
    carrito,
  });
};

export const getCartController = async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartModel
    .findById(cid)
    .populate("products.product")
    .lean();

  if (cart.products.length > 0) {
    return res.render("cart", { cart });
  } else {
    return res.send({
      code: 404,
      status: "Error",
      message: "El carrito: " + cid + " se encuentra vacío",
    });
  }
};

export const putProductsToCartController = async (req, res) => {
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
};

export const putCartController = async (req, res) => {
  const cid = req.params.cid;
  try {
    const carritoNuevo = req.body;

    const cart = await cartModel.findOne({ _id: cid });
    if (cart) {
      cart.products = carritoNuevo;

      await cartModel.updateOne({ _id: cid }, { $set: cart });

      res.send({ code: 202, status: "Success", message: cart.products });
    }
  } catch (error) {
    return res.send({
      code: 404,
      status: "Error",
      message: "El carrito con el id: " + cid + " no existe",
    });
  }
};

export const deleteProductToCartController = async (req, res) => {
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
};

export const deleteProductsToCartController = async (req, res) => {
  const cid = req.params.cid;

  const cart = await cartModel.findOne({ _id: cid });

  cart.products.splice(0, cart.products.length);

  await cartModel.updateOne({ _id: cid }, { $set: cart });

  res.send({ code: 202, status: "Success", message: cart.products });
};
