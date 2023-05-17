import { Router } from "express";
import productoModel from "../dao/models/products.model.js";

const router = Router();

//Funcion que identifica el tipo de respuesta para devolver el objeto segun el criterio pasado por query
const devolverObjeto = (
  res,
  totalDocs,
  prevPage,
  nextPage,
  page,
  hasNextPage,
  hasPrevPage,
  limit,
  result
) => {
  res.send({
    status: "success",
    payload: result,
    totalPages: totalDocs,
    prevPage: prevPage,
    nextPage: nextPage,
    page: page,
    hasPrevPage: hasPrevPage,
    hasNextPage: hasNextPage,
    prevLink: hasPrevPage
      ? "/products?page=" + prevPage + "&limit=" + limit
      : null,
    nextLink: hasNextPage
      ? "/products?page=" + nextPage + "&limit=" + limit
      : null,
  });
};

//Devuelve el objeto con la información pedida
router.get("/", async (req, res) => {
  const { limit = 10, page = 1, query, sort } = req.query;

  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs } =
    await productoModel.paginate({}, { limit: limit, page, lean: true });

  const products = docs;

  try {
    if (sort == "desc") {
      const result = await productoModel.aggregate([
        { $group: { _id: "$price", products: { $push: "$$ROOT" } } },
        { $sort: { _id: -1 } },
      ]);

      devolverObjeto(
        res,
        totalDocs,
        prevPage,
        nextPage,
        page,
        hasNextPage,
        hasPrevPage,
        limit,
        result
      );
    } else if (sort == "asc") {
      const result = await productoModel.aggregate([
        { $group: { _id: "$price", products: { $push: "$$ROOT" } } },
        { $sort: { _id: 1 } },
      ]);

      devolverObjeto(
        res,
        totalDocs,
        prevPage,
        nextPage,
        page,
        hasNextPage,
        hasPrevPage,
        limit,
        result
      );
    } else if (query == "category") {
      const result = await productoModel.aggregate([
        { $group: { _id: "$category", products: { $push: "$$ROOT" } } },
      ]);

      devolverObjeto(
        res,
        totalDocs,
        prevPage,
        nextPage,
        page,
        hasNextPage,
        hasPrevPage,
        limit,
        result
      );
    } else if (query == "status") {
      const result = await productoModel.aggregate([
        { $group: { _id: "$status", products: { $push: "$$ROOT" } } },
      ]);

      devolverObjeto(
        res,
        totalDocs,
        prevPage,
        nextPage,
        page,
        hasNextPage,
        hasPrevPage,
        limit,
        result
      );
    } else {
      devolverObjeto(
        res,
        totalDocs,
        prevPage,
        nextPage,
        page,
        hasNextPage,
        hasPrevPage,
        limit,
        products
      );
    }
  } catch (error) {
    console.error(err);
  }
});

//Vista de los productos
router.get("/products", async (req, res) => {
  const { limit = 10, page = 1 } = req.query;

  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs } =
    await productoModel.paginate({}, { limit: limit, page, lean: true });
  const products = docs;

  res.render("products", {
    products,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    totalDocs,
    limit,
  });
});

//Devuelve el producto con el pid especificado
router.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;

  try {
    const result = await productoModel.find({ _id: pid });

    if (result.length > 0) {
      return res.status(200).send({ status: "sucess", result });
    }
  } catch (error) {
    res.status(400).send({
      status: "error",
      error: "El producto con id: " + pid + " no existe",
    });
  }
});

//Agrega un producto pasado por el body
router.post("/products", async (req, res) => {
  const { title, description, price, status, thumbnail, code, stock } =
    req.body;

  const producto = {
    title,
    description,
    price,
    status,
    thumbnail,
    code,
    stock,
  };

  const result = await productoModel.create(producto);

  res.send({ result });
});

//Actualiza un producto pasado por el body
router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const updateProducto = req.body;

  try {
    const result = await productoModel.updateOne(
      { _id: id },
      { $set: updateProducto }
    );
    res.send({ result });
  } catch (error) {
    return res.send({ error: "id no encontrado" });
  }
});

//Elimina un producto por el pid pasado por params
router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    await productoModel.deleteOne({ _id: id });

    res.send({
      status: "Success",
      message: "Producto borrado",
    });
  } catch (error) {
    return res.send({ error: "Producto no encontrado" });
  }
});

export default router;
