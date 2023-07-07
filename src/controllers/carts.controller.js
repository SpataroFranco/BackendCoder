import CarritoManager from "../dao/managers/CarritoManager.js";
import ProductManager from "../dao/managers/ProductManager.js";
import TicketManager from "../dao/managers/ticketManager.js";
import { v4 as uuidv4 } from "uuid";
import transporter from "../config/gmail.js";
import { config } from "../config/config.js";

const managerCart = new CarritoManager();
const managerProduct = new ProductManager();
const managerTicket = new TicketManager();

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

export const purchaseController = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await managerCart.getCartById(cartId);
    // const userEmail = req.user.email
    // console.log(userEmail);
    let total = 0;

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

          //Restar del stock del producto la quantity solicitada
          await managerProduct.updateStock(
            cartProduct._id,
            parseInt(cartProduct.product.stock) - parseInt(cartProduct.quantity)
          );
        } else {
          rejectedProducts.push(cartProduct._id);
        }
      }

      const newTicket = {
        code: uuidv4(),
        purchase_datetime: new Date().toLocaleDateString(),
        amount: parseInt(total),
        // purchaser: req.user.email,
        products: ticketProducts,
      };

      const ticketCreated = await managerTicket.createTicket(newTicket);
      await managerCart.updateCart(cartId, cart);
      console.log(ticketCreated);
      if (ticketCreated) {
        try {
          const contenido = await transporter.sendMail({
            from: "spataroFranco1@gmail.com",
            to: "spataroFranco1@gmail.com",
            subject: "Compra realizada",
            html: `<div>
            <h1>Compra realizada con exito!</h1> 
            <strong>Monto total</strong>: ${total}</div>`,
          });
          console.log(contenido);
          res.json({ status: "success", message: "Correo enviado con excito" });
        } catch (error) {
          console.log(error);
          res.json({
            status: "error",
            message: "Hubo error al enviar el correo",
          });
        }
      }
    } else {
      res.send("El carrito no existe");
    }
  } catch (error) {
    res.send(error.message);
  }
};
