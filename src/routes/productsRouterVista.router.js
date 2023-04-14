import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();

const manager = new ProductManager();

const productos = await manager.getProducts();

router.get("/", async (req, res) => {
    const limit = req.query.limit;
  
    if (!limit || limit > productos.length) {
      return res.render("home", { productos: productos, style:"index.css" });
    }
    let productosLimit = [];
    for (let index = 0; index < limit; index++) {
      productosLimit.push(productos[index]);
    }
    res.render("home", { productos: productosLimit ,
    style:"index.css"});
  });

export default router;
