const c = [
  {
    id: 1,
    products: [
      { product: 1, quantity: 2 },
      { product: 2, quantity: 5 },
    ],
  },
  {
    id: 2,
    products: [
      { product: 6, quantity: 8 },
      { product: 9, quantity: 1 },
    ],
  },
];

let idCarro = 2;
let idProd = 6;

for (let i = 0; i < c.length; i++) {
  if (c[i].id == idCarro) {
    for (let e = 0; e < c[i].products.length; e++) {
      if (c[i].products[e].product == idProd) {
        if (c[i].products[e].product == idProd) {
          c[i].products[e].quantity += 1;
        } else {
          c[i].products[e].product = idProd;
          c[i].products[e].quantity = 1;
        }
      }
    }
  }
}

c.forEach(element => {
  console.log(element)
});
