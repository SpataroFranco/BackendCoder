import { Router } from "express";
import ProductManager from "../dao/managers/ProductManager.js";

const router = Router();

const manager = new ProductManager();

const productos = await manager.getProducts();

router.get("/", (req, res)=>{
    res.render("realTimeProducts",{productos:productos});
})

export default router;