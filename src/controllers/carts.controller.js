import CarritoManager from "../dao/managers/CarritoManager.js";

const managerCart = new CarritoManager();

export const getCartsController = async (req, res) => {
  const result = await managerCart.getCarts();
  res.send({ Carritos: result });
};

export const postCartController = async (req, res) => {
  const newCart = managerCart.addCart(req.body);
  res.send({
    status: "Success",
    payload: newCart,
  });
};

export const getCartController = async (req, res) => {
  const cart = await managerCart.getCartById(req.params.cid);

  if (cart.products.length > 0) {
    return res.render("cart", { cart });
  } else {
    return res.send({
      code: 404,
      status: "Error",
      message: "El carrito: " + cart._id + " se encuentra vacío",
    });
  }
};

export const putProductsToCartController = async (req, res) => {
  const cantidad = req.body;
  const cid = req.params.cid;
  const productId = req.params.pid;

  const cart = managerCart.addProductToCart(cid, productId, cantidad);

  res.send({ res: cart.products });
};

export const putCartController = async (req, res) => {
  const cid = req.params.cid;
  try {
    const newCart = req.body;

    await managerCart.addProductsToCart(cid, newCart, res);
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductToCartController = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    await managerCart.deleteProductToCart(cid, pid, res);
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductsToCartController = async (req, res) => {
  const cid = req.params.cid;

  try {
    await managerCart.deleteProductsToCart(cid);
  } catch (error) {
    console.log(error);
  }

  res.send({ code: 202, status: "Success", message: cart.products });
};

export const finishBuy = async (req, res) => {
  res.render("purchase", {
    cart: req.params.cid,
    //valores del carrito
  });
};
