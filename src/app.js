import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import productsRouterVista from "./routes/productsRouterVista.router.js";
import realTimeProducts from "./routes/realTimeProducts.routes.js";


const PORT = 8080;

const app = express();

const server = app.listen(PORT, ()=>{
  console.log("Servidor funcionando en el puerto: " + PORT);
} )

const socketServerIO = new Server(server); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", productsRouterVista);
app.use("/realtimeproducts", realTimeProducts);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

socketServerIO.on("connection", socket=>{
  console.log("Cliente conectado");

  socket.on("message", data =>{
    socketServerIO.emit("log", data)
  })
})