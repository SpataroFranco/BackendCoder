import fs from "fs";

class ProductManager {
  constructor() {
    this.path = "./Products.json";
  }

  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(data);
        return products;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  validarDatos(title, description, price, thumbnail, code, stock) {
    if (title == "" || title == null) {
      console.log("Por favor ingrese un titulo");
    }
    if (description == "" || description == null) {
      console.log("Por favor ingrese una descripcion");
    }
    if (price == "" || price == null) {
      console.log("Por favor ingrese un precio");
    }
    if (thumbnail == "" || thumbnail == null) {
      console.log("Por favor ingrese una ruta de imagen");
    }
    if (stock == "" || stock == null) {
      console.log("Por favor ingrese un stock");
    }
    if (code == "" || code == null) {
      console.log("Por favor ingrese un codigo identificador");
    }
  }

  addProduct = async (producto) => {
    try {
      const productos = await this.getProducts();

      if (
        !producto.title ||
        !producto.description ||
        !producto.price ||
        !producto.thumbnail ||
        !producto.code ||
        !producto.stock
      ) {
        this.validarDatos(
          producto.title,
          producto.description,
          producto.price,
          producto.thumbnail,
          producto.code,
          producto.stock
        );
      } else {
        let codigoProducto;
        for (let index = 0; index < productos.length; index++) {
          let prod = productos[index];
          if (prod.code === producto.code) {
            codigoProducto = code;
          } else {
            codigoProducto = null;
          }
        }

        if (codigoProducto) {
          console.log("Ya hay un producto con ese codigo identificador");
        } else {
          if (productos.length === 0) {
            producto.id = 1;
          } else {
            producto.id = productos[productos.length - 1].id + 1;
          }
          productos.push(producto);
        }
      }

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productos, null, "\t")
      );
    } catch (error) {
      console.log(error);
    }
  };

  getProductById = async (id) => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(data);
        let prod;
        for (let index = 0; index < products.length; index++) {
          let producto = products[index];
          if (producto.id === id) {
            prod = producto;
          }
        }
        if (prod) {
          return prod;
        } else {
          return console.error("Not found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (idProd, producto) => {
    let productos = await this.getProducts();

    productos.map(function (dato) {
      if (dato.id == idProd) {
        dato.title = producto.title;
        dato.description = producto.description;
        dato.price = producto.price;
        dato.thumbnail = producto.thumbnail;
        dato.code = producto.code;
        dato.stock = producto.stock;
      }
    });
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productos, null, "\t")
    );
  };

  deleteProduct = async (idProd) => {
    try {
      const productos = await this.getProducts();
      const producto = await this.getProductById(idProd);
      let i = 0;
      let encontrado = false;
      while (i <= productos.length && !encontrado) {
        if (productos[i].id == producto.id) {
          productos.splice(i, 1);
          encontrado = true;
        } else {
          ++i;
        }
      }
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productos, null, "\t")
      );
    } catch (error) {
      console.log(error);
    }
  };
}

const p = new ProductManager();
console.log(await p.getProducts());
console.log("-----------------------------------");
let producto = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 300,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 10,
};

let producto2 = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 300,
  thumbnail: "Sin imagen",
  code: "bce342",
  stock: 10,
};
await p.addProduct(producto);
await p.addProduct(producto2);
console.log(await p.getProducts());
console.log("-----------------------------------");
console.log(await p.getProductById(10));
console.log("-----------------------------------");
console.log(await p.getProductById(2));
console.log("-----------------------------------");
let nuevoProducto = {
  title: "elNuevo",
  description: "aaa",
  price: 100,
  thumbnail: "no",
  code: "codigoo",
  stock: 10,
};
await p.updateProduct(2, nuevoProducto);
await p.deleteProduct(1);
console.log("-----------------------------------");
await p.getProducts();
