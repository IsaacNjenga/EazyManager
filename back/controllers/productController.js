import express from "express";
import ProductsModel from "../models/productsModel.js";

const getProducts = async (req, res) => {
  try {
    const products = await ProductsModel.find({});
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  const id = req.params.id;
  ProductsModel.findById(id)
    .then((products) => res.json(products))
    .catch((err) => res.json(err));
};
const addProduct = async (req, res) => {
  const {
    number,
    description,
    colour,
    price,
    quantity,
    code,
    location,
    bnumber,
    summary,
    //image,
  } = req.body;

  const newProduct = new ProductsModel({
    number,
    description,
    colour,
    price,
    quantity,
    code,
    location,
    bnumber,
    summary,
    //image,
  });

  newProduct
    .save()
    .then((product) => res.json(product))
    .catch((error) => {
      if (error.message === "PayloadTooLargeError") {
        res.status(400).json({
          error: "PayloadTooLargeError",
          message: "Request entity too large",
        });
      } else {
        res.status(500).json({
          error: "ServerError",
          message: "An unexpected error occurred",
        });
      }
    });
};
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  ProductsModel.findByIdAndDelete({ _id: id })
    .then((products) => res.json(products))
    .catch((err) => res.json(err));
};
const updateProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

export { getProduct, getProducts, addProduct, deleteProduct, updateProduct };
