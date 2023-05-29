import { Router } from "express";
import productoModel from "../dao/models/products.model.js";

const router = Router();

const publicAcces = (req, res, next) => {
  if (req.session.user) return res.redirect("/profile/products");
  next();
};

const privateAcces = (req, res, next) => {
  if (!req.session.user) return res.redirect("/");
  next();
};

router.get("/register", publicAcces, (req, res) => {
  res.render("register");
});

router.get("/", publicAcces, (req, res) => {
  res.render("login");
});

router.get("/profile/products", privateAcces, async (req, res) => {
  const { limit = 10, page = 1 } = req.query;

  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs } =
    await productoModel.paginate({}, { limit: limit, page, lean: true });
  const products = docs;

  res.render("products", {
    user: req.session.user,
    products,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    totalDocs,
    limit
  });
});

router.get("/resetPassword", publicAcces, (req, res) =>{
  res.render("resetPassword")
})

export default router;
