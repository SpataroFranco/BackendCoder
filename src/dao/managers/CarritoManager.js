import cartModel from "../models/carts.model.js";

class CarritoManager {
  constructor() {
    this.model = cartModel;
  }

  getCarts = async () => {
    try {
      return this.model.find();
    } catch (error) {
      console.log(error);
    }
  };

  addCart = async (cart) => {
    try {
      const newCart = await this.model.create(cart);
    } catch (error) {
      console.log(error);
    }
  };

  getCartById = async (id) => {
    try {
      return await this.model.findById(id).populate("products.product").lean();
    } catch (error) {
      console.log(error);
    }
  };

  addProductToCart = async (idCart, productId, cantidad) => {
    try {
      const cart = await this.model.findOne({ _id: idCart });

      const prodIndex = cart.products.findIndex(
        (cprod) => cprod.product == productId
      );

      const quantity = cantidad.cantidad;

      parseInt(quantity);

      if (prodIndex === -1) {
        const product = {
          product: productId,
          quantity: quantity,
        };
        cart.products.push(product);
      } else {
        let total = cart.products[prodIndex].quantity;
        cart.products[prodIndex].quantity = total + quantity;
      }

      await this.model.updateOne({ _id: idCart }, { $set: cart });
    } catch (error) {
      console.log(error);
    }
  };

  addProductsToCart = async (cid, newCart, res) => {
    try {
      const carritoNuevo = newCart;

      const cart = await this.model.findOne({ _id: cid });

      if (cart) {
        cart.products = carritoNuevo;

        await this.model.updateOne({ _id: cid }, { $set: cart });

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

  deleteProductToCart = async (cid, pid, res) => {
    const cart = await this.model.findOne({ _id: cid });

    const prodIndex = cart.products.findIndex((cprod) => cprod.product == pid);

    if (prodIndex === -1) {
      return res.send({
        code: 404,
        status: "Error",
        message: "El producto no existe en el carrito",
      });
    } else {
      cart.products.splice(prodIndex, 1);
      await this.model.updateOne({ _id: cid }, { $set: cart });

      res.send({ code: 202, status: "Success", message: cart.products });
    }
  };

  deleteProductsToCart = async (cid) => {
    const cart = await this.model.findOne({ _id: cid });

    cart.products.splice(0, cart.products.length);
  
    await this.model.updateOne({ _id: cid }, { $set: cart });
  };

  updateCart = async (cartId, cart) => {
    await this.model.updateOne({_id:cartId}, cart)
  }
}

export default CarritoManager;
