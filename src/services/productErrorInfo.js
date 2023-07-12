export const generateProductErrorInfo = (product) => {
    return `
      Alguno de los campos para crear el usuario no es valido:
      Lista de campos requeridos:
      title: Debe ser un campo string, pero recibio ${product.title}
      description: Debe ser un campo string, pero recibio ${product.description}
      price: Debe ser un campo number, pero recibio ${product.price}
      status: Debe ser un campo boolean, pero recibio ${product.status}
      thumbnail: Debe ser un campo array, pero recibio ${product.thumbnail}
      code: Debe ser un campo string, pero recibio ${product.code}
      stock: Debe ser un campo number, pero recibio ${product.stock}
      `;
  };
  