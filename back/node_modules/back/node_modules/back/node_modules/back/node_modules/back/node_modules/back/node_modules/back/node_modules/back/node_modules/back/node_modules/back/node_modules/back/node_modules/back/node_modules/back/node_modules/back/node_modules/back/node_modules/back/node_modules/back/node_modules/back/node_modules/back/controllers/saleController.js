import express from "express";
import ProductsModel from "../models/productsModel.js";
import SalesModel from "../models/salesModel.js";

const getSales = async (req, res) => {
  SalesModel.find({})
    .then((sales) => res.json(sales))
    .catch((err) => res.json(err));
};

const getSale = async (req, res) => {
  const id = req.params.id;
  SalesModel.findById(id)
    .then((sales) => res.json(sales))
    .catch((err) => res.json(err));
};

const addSale = async (req, res) => {
  const {
    number,
    description,
    price,
    quantity,
    total,
    datesold,
    saleperson,
    commission,
    image,
    pnumber,
    code,
    colour,
  } = req.body;

  try {
    const newSale = new SalesModel({
      number,
      description,
      price,
      quantity,
      total,
      datesold,
      saleperson,
      commission,
      image,
      pnumber,
      code,
      colour,
    });

    const savedSale = await newSale.save();

    const product = await ProductsModel.findOne({ number: pnumber });

    if (!product) {
      return res.status(404).json({ error: "Product not Found" });
    }
    product.quantity -= quantity;
    await product.save();

    res.json(savedSale);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const deleteSale = async (req, res) => {
  const id = req.params.id;
  SalesModel.findByIdAndDelete({ _id: id })
    .then((sales) => res.json(sales))
    .catch((err) => res.json(err));
};

const updateSale = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedSale = await SalesModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedSale);
  } catch (err) {
    res.status(400).json(err);
  }
};

export { getSale, getSales, addSale, deleteSale, updateSale };
