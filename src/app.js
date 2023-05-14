import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import chatModel from "./dao/models/messages.model.js";
import mongoose from "mongoose";
import productsRouter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
import chatsRouter from "./routes/chats.route.js";

//Coneccion a la base de datos "ecommerce"
const MONGO = "mongodb+srv://francoSP:franco@cluster0.5fykqvu.mongodb.net/ecommerce"


const PORT = process.env.PORT || 8080;

const app = express();

await mongoose.connect(MONGO);

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
//Vistas con DB
app.use("/api", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/chats", chatsRouter);

//IO
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Cliente conectado");

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



// import cartModel from "./dao/models/carts.model.js";
// const cart = await cartModel.find({_id : "645ff8b20680fb7ef68657f1"})

// cart[0].products.push({product:"645edac724223e1d597b7ce0"})

// const result = await cartModel.updateOne({_id:"645ff8b20680fb7ef68657f1"},{$set: cart[0]})

// console.log(result)



// import cartModel from "./dao/models/carts.model.js";

// const cart = await cartModel.find({_id : "645ff8b20680fb7ef68657f1"});
// console.log(JSON.stringify(cart, null, "\t"))