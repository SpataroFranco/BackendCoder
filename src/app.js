import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import productsRouterVista from "./routes/productsRouterVista.router.js";
import realTimeProducts from "./routes/realTimeProducts.routes.js";
import ProductManager from "./dao/managers/ProductManager.js";
import chatModel from "./dao/models/messages.model.js";

import mongoose from "mongoose";
import productosRouterBD from "./routes/productosDB.route.js";
import cartsRouterBD from "./routes/cartsDB.route.js";
import chatsRouterBD from "./routes/chatsDB.route.js";


//Coneccion a la base de datos "ecommerce"
const MONGO = "mongodb+srv://francoSP:franco@cluster0.5fykqvu.mongodb.net/ecommerce"


const PORT = process.env.PORT || 8080;

const app = express();

const conection = mongoose.connect(MONGO);

const server = app.listen(PORT, () => {
  console.log("Servidor funcionando en el puerto: " + PORT);
});

//Servicio
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//Vistas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Rutas
//Vistas
app.use("/", productsRouterVista);
app.use("/realtimeproducts", realTimeProducts);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Vistas con DB
app.use("/productos", productosRouterBD);
app.use("/carts", cartsRouterBD);
app.use("/chats", chatsRouterBD);

//IO
const io = new Server(server);

const manager = new ProductManager();

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("carga", async () =>{
    let productos = await manager.getProducts();

    io.sockets.emit("lista", productos);
  })

  socket.on("message", async (data) => {
    const prod = {
      title: data.Titulo,
      description: data.Descripcion,
      price: data.Precio,
      status: data.Status,
      thumbnail: data.Thumbnail,
      code: data.Code,
      stock: data.Stock,
    };

    await manager.addProduct(prod);
    let productos = await manager.getProducts();

    io.sockets.emit("lista", productos);
  });

  socket.on("messageDelete", async (data) => {
    await manager.deleteProduct(parseInt(data));
    let productos = await manager.getProducts();

    io.sockets.emit("lista", productos);
  });

  socket.on("messageChat", async data =>{
    const chat = { user: data.user, message: data.message };
  
    await chatModel.create(chat);

    const mensajes = await chatModel.find();

    io.sockets.emit("messageLista", mensajes);
  })

  socket.on("authenticated", data =>{
    socket.broadcast.emit("newUserConnected", data);
  })
});
