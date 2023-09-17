import { addLogger } from "./middleware/logger.js";
import express from "express";
import handlebars from "express-handlebars";
import passport from "passport";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import chatModel from "./dao/models/messages.model.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cartsRouter from "./routes/carts.route.js";
import chatsRouter from "./routes/chats.route.js";
import viewRouter from "./routes/views.router.js";
import sessionRouter from "./routes/sessions.router.js";
import mockingsRouter from "./routes/mocking.router.js";
import initializePassport from "./config/passport.config.js";
import { config } from "./config/config.js";
import { connectDB } from "./config/dbConnection.js";
import productsRouter from "./routes/products.route.js";
import { swaggerSpecs } from "./config/docConfig.js";
import swaggerUi from "swagger-ui-express";
import loggerRoute from "./routes/logger.routes.js";
import usersRouter from "./routes/users.routes.js";

//Coneccion a la base de datos "ecommerce"
const MONGO = config.mongo.url;

const PORT = config.server.port;

const app = express();

connectDB();

const server = app.listen(PORT, () => {
  console.log("Servidor funcionando en el puerto: " + PORT);
});
app.use(addLogger)
//Servicio
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    store: new MongoStore({
      mongoUrl: MONGO,
      ttl: 3600,
    }),
    secret: config.server.clave_secreta,
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Vistas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Rutas
//Vistas con DB
const viewsRouter = new viewRouter();
const sessionsRouter = new sessionRouter();
const cartRouter = new cartsRouter();
const chatRouter = new chatsRouter();
const mockingRouter = new mockingsRouter(); 
const productRouter = new productsRouter();
const userRouter = new usersRouter();

app.use("/", viewsRouter.getRouter());
// app.use("/api/products", productRouter.getRouter());
// app.use("/api/carts", cartRouter.getRouter());
// app.use("/api/chats", chatRouter.getRouter());
// app.use("/api/session", sessionsRouter.getRouter());
// app.use("/api/users", userRouter.getRouter());
// app.use("/mockingproducts", mockingRouter.getRouter())
// app.use("/loggertest", loggerRoute)
// //Ruta de la documentacion
// app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

//IO
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("messageChat", async (data) => {
    const chat = { user: data.user, message: data.message };

    await chatModel.create(chat);

    const mensajes = await chatModel.find();

    io.sockets.emit("messageLista", mensajes);
  });

  socket.on("authenticated", (data) => {
    socket.broadcast.emit("newUserConnected", data);
  });
});

export {app};