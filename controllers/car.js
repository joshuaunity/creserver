const asynchandler = require('express-async-handler');
const mongoose = require('mongoose');

const Car = require('../models/Car');


const getCars = asynchandler(async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

const createCar = asynchandler(async (req, res) => {
    const { brand, model } = req.body;

    if (!brand) {
        return res.status(400).send({
            error: "Brand field is required"
        });
    }

    if (!model) {
        return res.status(400).send({
            error: "Model field is required"
        });
    }

    const newCar = new Car({ brand, model });
    await newCar.save();

    res.status(201).json(newCar);
});

const getCar = asynchandler(async (req, res) => {
    carId = req.params.id;

    if (carId && mongoose.Types.ObjectId.isValid(carId)) {
        await Car.findById(carId)
            .then((car) => {
                if (!car) {
                    res.status(404).json({
                        error: "Car not Found"
                    });
                }
                res.status(200).json(car);
            })
            .catch((error) => {
                res.status(400).json({
                    error: error.message
                })
            });
    } else {
        res.status(400).json({
            error: "Invalid Car ID"
        });
    }
});

const updateCar = asynchandler(async (req, res) => {
    const { brand, model } = req.body;
    carId = req.params.id;

    let car = await Car.findByIdAndUpdate(
        carId,
        { brand, model },
        { new: true }
    ).catch((error) => {
        res.status(400).json({
            error: error.message
        })
    });

    res.status(200).json(car);
});

const deleteCar = asynchandler(async (req, res) => {
    carId = req.params.id;

    await Car.findById(carId)
        .then((car) => {
            if (!car) {
                return res.status(404).json({
                    error: "Car not Found"
                });
            }
        })
        .catch((error) => {
            res.status(400).json({
                error: error.message
            })
        });


    await Car.findByIdAndDelete(carId)
        .catch((error) => {
            res.status(400).json({
                error: error.message
            })
        });

    res.status(200).json({});
});

module.exports = {
    getCars,
    createCar,
    getCar,
    updateCar,
    deleteCar
};