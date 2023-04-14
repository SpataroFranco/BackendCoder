// import ProductManager from "../ProductManager.js";

const socket = io();
// const manager = new ProductManager();
// const productos = await manager.getProducts();

const titulo = document.getElementById("titulo");
const des = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const thumb = document.getElementById("thumbnail");
const code = document.getElementById("code");
const stock = document.getElementById("stock");

const log = document.getElementById("log");

titulo.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    socket.emit("message", titulo.value);
    titulo.value = "";
  }
});

socket.on("log", (data) => {
  log.innerHTML += data+"\n";
});
