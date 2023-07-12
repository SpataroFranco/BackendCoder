import ProductManager from "../dao/managers/ProductManager.js";
import { generateMocking } from "../utils.js";
import { Error } from "../enums/Error.js";
import { generateProductErrorInfo } from "../services/productErrorInfo.js";
import { generateProductErrorParam } from "../services/productErrorParam.js";
import { CustomError } from "../services/customError.service.js";

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

    if (!title || !description || !price || !status || !thumbnail || !code || !stock) {
      CustomError.createError({
        name: "Product register error",
        cause: generateProductErrorInfo(req.body),
        message: "Error cargando al producto",
        errorCode: Error.INVALID_JSON,
      });
    }

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
  const id = parseInt(req.params.pid);
  const updateProducto = req.body;

  try {
    if(Number.isNaN(id)){
      CustomError.createError({
        name: "Product get by id error",
        cause: generateProductErrorParam(id),
        message: "Error obteniendo el id del producto",
        errorCode: Error.INVALID_PARAM
      })
    }
    await managerProduct.putProduct(id, updateProducto, res);
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductController = async (req, res) => {
  const id = parseInt(req.params.pid);
  if(Number.isNaN(id)){
    CustomError.createError({
      name: "Product get by id error",
      cause: generateProductErrorParam(id),
      message: "Error obteniendo el id del producto",
      errorCode: Error.INVALID_PARAM
    })
  }
  try {
    await managerProduct.deleteProduct(id, res);
  } catch (error) {
    console.log(error);
  }
};

export const updateProductController = async (req, res) => {
  try {
    const id = req.params.pid;
    const cantidad = req.body;
    if(Number.isNaN(id)){
      CustomError.createError({
        name: "Product get by id error",
        cause: generateProductErrorParam(id),
        message: "Error obteniendo el id del producto",
        errorCode: Error.INVALID_PARAM
      })
    }
    await managerProduct.updateStock(id, cantidad);
  } catch (error) {
    console.log(error);
  }
};

export const mockingProductsController = async (req, res) => {
  const products = generateMocking();
  res.send({ status: "success", payload: products });
};
