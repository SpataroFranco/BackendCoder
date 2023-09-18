import CarritoManager from "../dao/managers/CarritoManager.js";
import ProductManager from "../dao/managers/ProductManager.js";
import TicketManager from "../dao/managers/ticketManager.js";
import { v4 as uuidv4 } from "uuid";
import transporter from "../config/gmail.js";
import { Error } from "../enums/Error.js";
import { generateCartErrorParam } from "../services/cartErrorParam.js";
import { CustomError } from "../services/customError.service.js";
import productoModel from "../dao/models/products.model.js";
import userModel from "../dao/models/user.model.js";
import { userService } from "../repository/index.js";

const managerCart = new CarritoManager();
const managerProduct = new ProductManager();
const managerTicket = new TicketManager();

export const getCartsController = async (req, res) => {
  try {
    const result = await managerCart.getCarts();
    res.send({ payload: result, status: "success" });
    // res.status(200).json({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(error);
  }
};

export const postCartController = async (req, res) => {
  try {
    const newCart = managerCart.addCart(req.body);
    res.send({
      status: "Success",
      payload: newCart,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      errorType: "error en el post del servidor",
    });
  }
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
  const cid = parseInt(req.params.cid);
  const productId = req.params.pid;

  // if (Number.isNaN(cid)) {
  //   CustomError.createError({
  //     name: "Product get by id error",
  //     cause: generateCartErrorParam(cid),
  //     message: "Error obteniendo el id del carrito",
  //     errorCode: Error.INVALID_PARAM,
  //   });
  // }

  const cart = managerCart.addProductToCart(cid, productId, cantidad);

  res.send({ res: cart.products });
};

export const putCartController = async (req, res) => {
  const cid = parseInt(req.params.cid);

  const userDB = await userModel.findOne({ email: req.session.user.email });
  try {
    const newCart = req.body;
    // if (Number.isNaN(cid)) {
    //   CustomError.createError({
    //     name: "Product get by id error",
    //     cause: generateCartErrorParam(cid),
    //     message: "Error obteniendo el id del carrito",
    //     errorCode: Error.INVALID_PARAM,
    //   });
    // }


    await managerCart.addProductsToCart(cid, newCart, res);
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductToCartController = async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = req.params.pid;

  try {
    // if (Number.isNaN(cid)) {
    //   CustomError.createError({
    //     name: "Product get by id error",
    //     cause: generateCartErrorParam(cid),
    //     message: "Error obteniendo el id del carrito",
    //     errorCode: Error.INVALID_PARAM,
    //   });
    // }
    await managerCart.deleteProductToCart(cid, pid, res);
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductsToCartController = async (req, res) => {
  const cid = parseInt(req.params.cid);

  try {
    // if (Number.isNaN(cid)) {
    //   CustomError.createError({
    //     name: "Product get by id error",
    //     cause: generateCartErrorParam(cid),
    //     message: "Error obteniendo el id del carrito",
    //     errorCode: Error.INVALID_PARAM,
    //   });
    // }
    const result = await managerCart.deleteProductsToCart(cid);

    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
  }

  res.send({ code: 202, status: "Success", message: cart.products });
};


export const addProductInCart = async (req, res) => {
  const cartId = req.session?.user?.cart;
  const productId = req.params.pid;
  const product = await productoModel.findById(productId);
  const productOwer = product.owner?.toString();
  const reqUserId = req.user._id.toString();

  if (productOwer === reqUserId) {
    return res
      .status(404)
      .send({ error: "No puedes agregar este producto al carrito" });
  }
  try {
    const response = await managerCart.addProductInCartDB(cartId, productId);
    if (!response)
      return res
        .status(404)
        .send({ error: "No se pudo agregar, producto inexistente" });

    res.send({ status: "success", payload: response });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Error en el servidor" });
  }
};

export const finishCart = async (req, res) => {
  
  const cart = await managerCart.getCartById(req.params.cid);
  //HACER FUNCION PARA CALCULAR TOTAL DE LA COMPRA

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

export const purchaseController = async (req, res) => {
  try {
    const cartId = req.session?.user?.cart[0]._id;
    const cart = await managerCart.getCartById(cartId);
    const userEmail = req.user.email;
    let total = 0;

    // if (Number.isNaN(cartId)) {
    //   CustomError.createError({
    //     name: "Product get by id error",
    //     cause: generateCartErrorParam(cartId),
    //     message: "Error obteniendo el id del carrito",
    //     errorCode: Error.INVALID_PARAM,
    //   });
    // }
    if (cart) {
      if (!cart.products.length) {
        return res.send("Es necesario que agregue productos");
      }
      const ticketProducts = [];
      const rejectedProducts = [];

      for (let i = 0; i < cart.products.length; i++) {
        const cartProduct = cart.products[i];
        const productDB = await managerProduct.getProducto(
          cartProduct.product._id
        );

       
        if (cartProduct.quantity <= productDB[0].stock) {
          ticketProducts.push({
            productId: cartProduct._id,
            price: cartProduct.product.price,
          });

          total +=
            parseInt(cartProduct.quantity) * parseInt(productDB[0].price);

          let newStock =
            parseInt(productDB[0].stock) - parseInt(cartProduct.quantity);

          //Restar del stock del producto la quantity solicitada
          await productoModel.findOneAndUpdate(
            { _id: cartProduct._id },
            { $set: { stock: newStock } },
            { new: true }
          );
        } else {
          rejectedProducts.push(cartProduct._id);
        }
      }

      const newTicket = {
        code: uuidv4(),
        purchase_datetime: new Date().toLocaleDateString(),
        amount: parseInt(total),
        purchaser: userEmail,
        products: ticketProducts,
      };

      const ticketCreated = await managerTicket.createTicket(newTicket);

      if (ticketCreated) {
        // try {
        //   await transporter.sendMail({
        //     from: "CodersHouse",
        //     to: userEmail,
        //     subject: "Compra realizada",
        //     html: `
        //     <h1>Compra realizada con exito!</h1> 
        //     <strong>Monto total</strong>: ${total}`,
        //   });
        //   res
        //     .status(200)
        //     .json({
        //       status: "success",
        //       message: "Compra realizada con exito!",
        //     });
        // } catch (error) {
        //   req.logger.error(error);
        // }
        res.send({ status: "success", payload: ticketCreated });
       
      }
    } else {
      res.send("El carrito no existe");
    }
  } catch (error) {
    req.logger.error(error);
    res.send(error.message);
  }
};
