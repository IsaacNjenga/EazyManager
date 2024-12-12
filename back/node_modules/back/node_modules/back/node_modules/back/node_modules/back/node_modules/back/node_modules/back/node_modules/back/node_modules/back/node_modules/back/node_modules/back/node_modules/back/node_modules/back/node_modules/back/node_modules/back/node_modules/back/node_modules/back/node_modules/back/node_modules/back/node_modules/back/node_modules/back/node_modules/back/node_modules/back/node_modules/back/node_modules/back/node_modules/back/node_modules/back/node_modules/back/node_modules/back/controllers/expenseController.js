import express from "express";
import ExpensesModel from "../models/expensesModel.js";

const getExpenses = async (req, res) => {
  ExpensesModel.find({})
    .then((expenses) => res.json(expenses))
    .catch((err) => res.json(err));
};

const getExpense = async (req, res) => {
  const id = req.params.id;
  ExpensesModel.findById(id)
    .then((expenses) => res.json(expenses))
    .catch((err) => res.json(err));
};

const addExpense = async (req, res) => {
  const { number, description, cost, category, date } = req.body;

  const newExpense = new ExpensesModel({
    number,
    description,
    cost,
    category,
    date,
  });

  newExpense
    .save()
    .then((expense) => res.json(expense))
    .catch((err) => res.status(400).json(err));
};

const deleteExpense = async (req, res) => {
  const id = req.params.id;
  ExpensesModel.findByIdAndDelete({ _id: id })
    .then((expenses) => res.json(expenses))
    .catch((err) => res.json(err));
};

const updateExpense = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedExpense = await ExpensesModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getExpense, getExpenses, addExpense, deleteExpense, updateExpense };
