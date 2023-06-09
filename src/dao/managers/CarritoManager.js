import fs from "fs";

class CarritoManager {
  constructor() {
    this.path = "files/Carrito.json";
  }

  getCarts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");

        const carts = JSON.parse(data);

        return carts;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  addCart = async (cart) => {
    try {
      const carts = await this.getCarts();

      if (carts.length === 0) {
        cart.id = 1;
      } else {
        cart.id = carts[carts.length - 1].id + 1;
      }
      cart.products = [];
      carts.push(cart);

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    } catch (error) {
      console.log(error);
    }
  };

  getCartById = async (id) => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(data);
        let c;
        for (let index = 0; index < carts.length; index++) {
          let cart = carts[index];
          if (cart.id === id) {
            c = cart;
          }
        }
        if (c) {
          return c;
        } else {
          return console.error("Carrito no encontrado");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  addProductToCart = async (idCart, product) => {
    try {
      const carritos = await this.getCarts();
      // const cart = await this.getCartById(parseInt(idCart));

      //Recorro carritos
      for (let i = 0; i < carritos.length; i++) {
        if (carritos[i].id == idCart) {
          //Recorro productos en el carrito encontrado
          let valores = Object.values(carritos[i].products);
          let encontrado = false;
          let j = 0;
          while (!encontrado && j < valores.length) {
            if (valores[j].product == product.id) {
              valores[j].quantity += 1;
              encontrado = true;
            } else {
              j++;
            }
          }
          if (encontrado == false) {
            carritos[i].products.push({ product: product.id, quantity: 1 });
          }
        }
      }

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carritos, null, "\t")
      );
    } catch (error) {
      console.log(error);
    }
  };
}

export default CarritoManager;
