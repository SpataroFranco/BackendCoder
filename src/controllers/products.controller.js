import ProductManager from "../dao/managers/ProductManager.js";
import ProductDTO from "../dao/dto/product.dto.js";
import { generateMocking } from "../utils.js";
import { Error } from "../enums/Error.js";
import { generateProductErrorInfo } from "../services/productErrorInfo.js";
import { generateProductErrorParam } from "../services/productErrorParam.js";
import { CustomError } from "../services/customError.service.js";

const managerProduct = new ProductManager();

export const getProductsObjectController = async (req, res) => {
  // const { limit = 10, page = 1, query, sort } = req.query;
  // try {
  //   await managerProduct.getProductsObject(limit, page, query, sort, res, req);
  // } catch (error) {
  //   console.error(err);
  // }
  try {
    return await managerProduct.devolverProductos(req, res);
  } catch (error) {
    console.log(error);
  }
};

export const getProductsController = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;

  await managerProduct.getProducts(limit, page, res);
};

export const getProductController = async (req, res) => {
  const pid = req.params.pid;

  await managerProduct.getProduct(pid, res, req);
};

export const postProductController = async (req, res) => {
  const { title, description, price, status, thumbnail, code, stock, category } =
    req.body;

    // if (!title || !description || !price || !status || !thumbnail || !code || !stock) {
    //   CustomError.createError({
    //     name: "Product register error",
    //     cause: generateProductErrorInfo(req.body),
    //     message: "Error cargando al producto",
    //     errorCode: Error.INVALID_JSON,
    //   });
    // }

  if(!title||!description||!price || !code || !stock || !category) return res.status(400).send({status:"error",error:"Incomplete values"})

  const product = ProductDTO.getProductInputFrom({title,description,price,status,code,stock,category})

  const result = await managerProduct.postProduct(product);

  res.status(200).json({ status: "success", payload: result });
};

export const putProductController = async (req, res) => {
  const id = parseInt(req.params.pid);
  const updateProducto = req.body;

  try {
    // if(Number.isNaN(id)){
    //   CustomError.createError({
    //     name: "Product get by id error",
    //     cause: generateProductErrorParam(id),
    //     message: "Error obteniendo el id del producto",
    //     errorCode: Error.INVALID_PARAM
    //   })
    // }
    await managerProduct.putProduct(id, updateProducto, res);
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductController = async (req, res) => {
  const id = parseInt(req.params.pid);
  // if(Number.isNaN(id)){
  //   CustomError.createError({
  //     name: "Product get by id error",
  //     cause: generateProductErrorParam(id),
  //     message: "Error obteniendo el id del producto",
  //     errorCode: Error.INVALID_PARAM
  //   })
  // }
  try {
    await managerProduct.deleteProduct(id);
    res.send({
      status: "Success",
      message: "Producto borrado",
    });
  } catch (error) {
    res.send({ error: "Producto no encontrado" });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const id = req.params.pid;
    const cantidad = req.body;
    // if(Number.isNaN(id)){
    //   CustomError.createError({
    //     name: "Product get by id error",
    //     cause: generateProductErrorParam(id),
    //     message: "Error obteniendo el id del producto",
    //     errorCode: Error.INVALID_PARAM
    //   })
    // }
    await managerProduct.updateStock(id, cantidad);
  } catch (error) {
    console.log(error);
  }
};

export const mockingProductsController = async (req, res) => {
  const products = generateMocking();
  res.send({ status: "success", payload: products });
};
