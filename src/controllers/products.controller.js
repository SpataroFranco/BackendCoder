import ProductManager from "../dao/managers/ProductManager.js";

const managerProduct = new ProductManager();

export const getProductsObjectController = async (req, res) => {
  const { limit = 10, page = 1, query, sort } = req.query;
  try {
    await managerProduct.getProductsObject(limit, page, query, sort, res);
  } catch (error) {
    console.error(err);
  }
};

export const getProductsController = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;

  await managerProduct.getProducts(limit, page, res);
};

export const getProductController = async (req, res) => {
  const pid = req.params.pid;

  await managerProduct.getProduct(pid, res);
};

export const postProductController = async (req, res) => {
  const { title, description, price, status, thumbnail, code, stock } =
    req.body;

  const result = await managerProduct.postProduct(
    title,
    description,
    price,
    status,
    thumbnail,
    code,
    stock
  );
  res.send({ result });
};

export const putProductController = async (req, res) => {
  const id = req.params.pid;
  const updateProducto = req.body;

  try {
    await managerProduct.putProduct(id, updateProducto, res);
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductController = async (req, res) => {
  const id = req.params.pid;

  try {
    await managerProduct.deleteProduct(id, res);
  } catch (error) {
    console.log(error);
  }
};
