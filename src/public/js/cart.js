// Objeto para almacenar la cantidad de unidades por producto
const productClickCounts = {};

// Almacena total de la compra
let totalCompra = 0;
// Almacena los titulos de los productos
let titulos = [];
// Almacena los product ID
let productoId = [];

// Seleccionar todos los botones de agregar al carrito
const addToCartButtons = document.querySelectorAll(".btn");

// Agregar un controlador de eventos a cada botón
addToCartButtons.forEach((button) => {
  button.addEventListener("click", addToCart);
});

// Función para manejar el evento de clic en el botón
function addToCart(event) {
  // Obtener el ID del producto desde los atributos data del botón
  const productId = event.target.dataset.productId;

  // Obtener los valores del producto desde los atributos data del botón
  const productTitle = event.target.dataset.productTitle;
  let productPrice = parseInt(event.target.dataset.productPrice);
  const productStock = parseInt(event.target.dataset.productStock);

  // Verificar si el contador para el producto ya existe en el objeto
  if (!productClickCounts[productId]) {
    productClickCounts[productId] = 0;
  }

  // Verificar si hay suficiente stock para el producto
  if (productClickCounts[productId] < productStock) {
    // Incrementar el contador de unidades para el producto
    productClickCounts[productId]++;

    totalCompra += productPrice;
    console.log(
      `Producto "${productTitle}": cantidad: ${productClickCounts[productId]}, Total de compra: ${totalCompra}`
    );

    if (!titulos.includes(productTitle)) {
      titulos.push(productTitle);
    }
    if (!productoId.includes(productId)) {
      productoId.push(productId);
    }
  } else {
    alert(`No hay más stock para el producto: ${productTitle}`);
  }
}

addToCart();
