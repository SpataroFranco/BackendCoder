const socket = io();

const log = document.getElementById("log");
const lista = document.getElementById("lista");

let valores = {};

boton.addEventListener("click", () => {
  socket.emit("message", valores);
});

socket.on("lista", (data) => {
  let foo = data.map(function(el){
    return "<p>"+"Titulo: "+el.title+"</p>"+
            "<p>"+"Descripcion: "+el.description+"</p>"+
            "<p>"+"Precio: "+el.price+"</p>"+
            "<p>"+"Status: "+el.status+"</p>"+
            "<p>"+"Thumbnail: "+el.thumbnail+"</p>"+
            "<p>"+"Code: "+el.code+"</p>"+
            "<p>"+"Stock: "+el.stock+"</p>"+
            "<p>"+"Id: "+el.id+"</p>"+
            "<br>";
  })
  lista.innerHTML = foo;
});

const getData = () => {
  let titulo = document.getElementById("titulo").value;
  let des = document.getElementById("descripcion").value;
  let precio = document.getElementById("precio").value;
  let status = document.getElementById("status").value;
  let thumb = document.getElementById("thumbnail").value;
  let code = document.getElementById("code").value;
  let stock = document.getElementById("stock").value;
  valores.Titulo = titulo;
  valores.Descripcion = des;
  valores.Precio = precio;
  valores.Status = status;
  valores.Thumbnail = thumb;
  valores.Code = code;
  valores.Stock = stock;
};
