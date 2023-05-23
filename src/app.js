import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import chatModel from "./dao/models/messages.model.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import productsRouter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
import chatsRouter from "./routes/chats.route.js";
import viewRouter from "./routes/views.router.js";
import sessionRouter from "./routes/sessions.router.js";


//Coneccion a la base de datos "ecommerce"
const DB = "ecommerce";
const MONGO = "mongodb+srv://francoSP:franco@cluster0.5fykqvu.mongodb.net/"+DB;

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

app.use(session({
  store: new MongoStore({
      mongoUrl: MONGO,
      ttl:3600
  }),
  secret:'CoderSecret',
  resave:false,
  saveUninitialized:false
}))

//Vistas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Rutas
//Vistas con DB
//app.use("/", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/chats", chatsRouter);

app.use("/", viewRouter);
app.use("/api/session", sessionRouter);

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