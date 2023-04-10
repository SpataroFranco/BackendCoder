import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import bodyParser from "body-parser";

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
  console.log("Servidor funcionando en el puerto: " + PORT);
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

