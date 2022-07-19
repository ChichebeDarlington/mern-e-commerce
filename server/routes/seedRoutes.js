import express from "express";
import { dataMerce } from "../data.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  await Product.deleteMany({});
  const createProducts = await Product.insertMany(dataMerce.products);
  await User.deleteMany({});
  const createUsers = await User.insertMany(dataMerce.users);
  res.send({ createProducts, createUsers });
});
export default seedRouter;
