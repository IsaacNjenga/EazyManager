import express from "express";
import StaffModel from "../models/staffModel.js";

const getStaffs = async (req, res) => {
  StaffModel.find({})
    .then((staff) => res.json(staff))
    .catch((err) => res.json(err));
};

const getStaff = async (req, res) => {
  const id = req.params.id;
  StaffModel.findById(id)
    .then((staff) => res.json(staff))
    .catch((err) => res.json(err));
};

const addStaff = async (req, res) => {
  const { id, firstname, lastname, datejoined, image, number } = req.body;

  const newStaff = new StaffModel({
    id,
    firstname,
    lastname,
    datejoined,
    image,
    number,
  });

  newStaff
    .save()
    .then((staff) => res.json(staff))
    .catch((err) => res.status(400).json(err));
};

const deleteStaff = async (req, res) => {
  const id = req.params.id;
  StaffModel.findByIdAndDelete({ _id: id })
    .then((staff) => res.json(staff))
    .catch((err) => res.json(err));
};

const updateStaff = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedStaff = await StaffModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedStaff);
  } catch (error) {
    res.status(400).json(err);
  }
};

export { getStaff, getStaffs, addStaff, deleteStaff, updateStaff };
