import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import productsRouterVista from "./routes/productsRouterVista.router.js";


const PORT = 8080;

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log("Servidor funcionando en el puerto: " + PORT);
});


app.use("/", productsRouterVista);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

