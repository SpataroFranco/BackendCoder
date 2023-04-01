import express from "express";
import ProductManager from "./ProductManager.js";

const PORT = 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));

let manager = new ProductManager();

app.listen(PORT, () => {
  console.log("Servidor funcionando en el puerto: " + PORT);
});

app.get("/products", async (req, res) => {
  const productos = await manager.getProducts();

  const limit = req.query.limit;

  if (!limit || limit > productos.length) {
    return res.send({ productos });
  }
  let productosLimit = [];
  for (let index = 0; index < limit; index++) {
    productosLimit.push(productos[index]);
  }

  res.send({ productos: productosLimit });
});

app.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;

  let producto = await manager.getProductById(parseInt(pid));

  if (!producto) {
    return res.send({ error: "Producto no encontrado" });
  }
  res.send({ producto });
});
