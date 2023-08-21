import productoModel from "../models/products.model.js";

class ProductManager {
  constructor() {
    this.model = productoModel;
  }

  devolverProductos = async (req, res) => {
    try {
      const result = await productoModel.find();
      res.send({ Productos: result });
    } catch (error) {
      res.send("error")
    }
  }

  //Funcion que identifica el tipo de respuesta para devolver el objeto segun el criterio pasado por query
  devolverObjeto = (
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

  getProductsObject = async (limit, page, query, sort, res, req) => {
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs } =
      await this.model.paginate({}, { limit: limit, page, lean: true });

    const products = docs;

    try {
      if (sort == "desc") {
        const result = await this.model.aggregate([
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
        const result = await this.model.aggregate([
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
        const result = await this.model.aggregate([
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
        const result = await this.model.aggregate([
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
      req.logger.error(error);
    }
  };

  getProducts = async (limit, page, res) => {
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs } =
      await this.model.paginate({}, { limit: limit, page, lean: true });
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
  };

  getProduct = async (pid, res, req) => {
    try {
      const result = await productoModel.find({ _id: pid });

      if (result.length > 0) {
        return res.status(200).send({ status: "sucess", result });
      }
    } catch (error) {
      req.logger.error(error);
      res.status(400).send({
        status: "error",
        error: "El producto con id: " + pid + " no existe",
      });
    }
  };

  getProducto = async (pid) => {
    const result = await productoModel.find({ _id: pid });

    return result;
  };

  postProduct = async (
    title,
    description,
    price,
    status,
    thumbnail,
    code,
    stock,
    category,
    owner
  ) => {
    const producto = {
      title,
      description,
      price,
      status,
      thumbnail,
      code,
      stock,
      category,
      owner
    };

    return await this.model.create(producto);
  };

  putProduct = async (pid, producto, res) => {
    try {
      const result = await this.model.updateOne(
        { _id: pid },
        { $set: producto }
      );
      res.send({ result });
    } catch (error) {
      return res.send({ error: "id no encontrado" });
    }
  };

  deleteProduct = async (pid, res) => {
    try {
      await productoModel.deleteOne({ _id: pid });

      res.send({
        status: "Success",
        message: "Producto borrado",
      });
    } catch (error) {
      return res.send({ error: "Producto no encontrado" });
    }
  };

  updateStock = async (pid, cantidad) => {
    try {
      await this.model.updateOne({ _id: pid }, { $set: { stock: cantidad } });
    } catch (error) {
      console.log(error);
    }
  };
}

export default ProductManager;
