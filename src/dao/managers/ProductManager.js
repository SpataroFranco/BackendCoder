import fs from "fs";

class ProductManager {
  constructor() {
    this.path = "files/Products.json";
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

  validarDatos(title, description, price, status, thumbnail, code, stock) {
    if (title == "" || title == null) {
      console.log("Por favor ingrese un titulo");
    }
    if (description == "" || description == null) {
      console.log("Por favor ingrese una descripcion");
    }
    if (price == "" || price == null) {
      console.log("Por favor ingrese un precio");
    }
    if (status != true || status != false) {
      console.log("Status debe ser true o false");
    }
    if (thumbnail == "" || thumbnail == null) {
      thumbnail = [];
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
        !producto.status ||
        !producto.code ||
        !producto.stock
      ) {
        this.validarDatos(
          producto.title,
          producto.description,
          producto.price,
          producto.status,
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

  updateProduct = async (
    idProd,
    titulo,
    descripcion,
    precio,
    status,
    thumbnail,
    code,
    stock
  ) => {
    let productos = await this.getProducts();

    const productoIndex = productos.findIndex((producto) => {
      return producto.id == idProd;
    });

    productos[productoIndex].title = titulo;
    productos[productoIndex].description = descripcion;
    productos[productoIndex].price = precio;
    productos[productoIndex].status = status;
    productos[productoIndex].thumbnail = thumbnail;
    productos[productoIndex].code = code;
    productos[productoIndex].stock = stock;

    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productos, null, "\t")
      );
      return "Producto modificado";
    } catch (error) {
      return error;
    }
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

export default ProductManager;

// const p = new ProductManager();
// console.log(await p.getProducts());
// console.log("-----------------------------------");
// let producto = {
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 300,
//   thumbnail: "Sin imagen",
//   code: "abc123",
//   stock: 10,
// };

// let producto2 = {
//   title: "producto prueba 2",
//   description: "Este es un producto prueba",
//   price: 600,
//   thumbnail: "Sin imagen",
//   code: "bce342",
//   stock: 20,
// };
// console.log(producto2["code"])
// await p.addProduct(producto);
// await p.addProduct(producto2);
// console.log(await p.getProducts());
// console.log("-----------------------------------");
// console.log(await p.getProductById(10));
// console.log("-----------------------------------");
// console.log(await p.getProductById(2));
// console.log("-----------------------------------");
// let nuevoProducto = {
//   title: "elNuevo",
//   description: "aaa",
//   price: 100,
//   thumbnail: "no",
//   code: "codigoo",
//   stock: 10,
// };
// await p.updateProduct(2, nuevoProducto.title,"nn",1200,true,["img1","img2"],"ncode",3300);
// await p.deleteProduct(1);
// console.log("-----------------------------------");
// await p.getProducts();
