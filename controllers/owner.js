const asynchandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Owner = require('../models/Owner');
const Car = require('../models/Car');

const JWTSECRET = process.env.JWTSECRET; // JWT Secret Key

const getOwners = asynchandler(async (req, res) => {
    try {
        const owners = await Owner.find();
        res.status(200).json(owners);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

const createOwner = asynchandler(async (req, res) => {
    const { name, car, email, password } = req.body;

    // Check if name is provided
    if (!name || !email || !password) {
        return res.status(400).json({
            error: "Name, Email and Password fields are required"
        });
    }

    // Set carID to null if car is not provided, else assign the provided car
    const carID = car || null;

    // hash owner's password
    const hashPassword = await bcrypt.hash(password, 10);

    try {
        // Create a new owner instance
        const newOwner = new Owner({
            name,
            car: carID,
            email,
            password: hashPassword
        });

        // Save the new owner to the database
        await newOwner.save();

        // Respond with the created owner object
        res.status(201).json(newOwner);
    } catch (error) {
        // Handle any errors that occur during saving
        res.status(500).json({
            error: "An error occurred while saving the owner"
        });
    }
});

const getOwner = asynchandler(async (req, res) => {
    const ownerID = req.user.id;

    await Owner.findById(ownerID)
        .then((owner) => {
            if (!owner) {
                return res.status(404).json({
                    error: "Owner not Found"
                });
            }
            res.status(200).json(owner);
        })
        .catch((error) => {
            res.status(400).json({
                error: error.message
            });
        });
});

const updateOwner = asynchandler(async (req, res) => {
    const ownerID = req.user.id;
    const { name, car, email } = req.body;
    const updatedCar = car || null;
    const isOwnerIDValid = mongoose.Types.ObjectId.isValid(ownerID);
    const isCarIDValid = mongoose.Types.ObjectId.isValid(updatedCar);

    if (!isOwnerIDValid) {
        return res.status(400).json({
            error: "Invalid Owner ID"
        });
    }

    if (!isCarIDValid) {
        return res.status(400).json({
            error: "Invalid Car ID"
        });
    }

    if (!name) {
        return res.status(400).json({
            error: "Name field is required"
        });
    }

    if (!email) {
        return res.status(400).json({
            error: "Email field is required"
        });
    }

    // check if owner exist
    await Owner.findById(ownerID)
        .then((owner) => {
            if (!owner) {
                return res.status(404).json({
                    error: "Owner not Found"
                });
            }
        })
        .catch((error) => {
            res.status(400).json({
                error: error.message
            });
        });

    // check if car exist
    await Car.findById(car)
        .then((car) => {
            if (!car) {
                return res.status(404).json({
                    error: "Car not Found"
                });
            }
        })
        .catch((error) => {
            console.log("car check error: ", error.message);
            res.status(400).json({
                error: error.message
            });
        });

    let owner = await Owner.findByIdAndUpdate(
        ownerID,
        { name: name, car: updatedCar },
        { new: true }
    ).catch((error) => {
        res.status(400).json({
            error: error.message
        });
    });

    res.status(200).json(owner);
});

const partialUpdateOwner = asynchandler(async (req, res) => {
    const ownerID = req.user.id;
    const { name, car, email } = req.body;

    let updatedOwnerData = {};
    if (name) updatedOwnerData.name = name;
    if (car && mongoose.Types.ObjectId.isValid(car)) {
        // check if car exist
        await Car.findById(car)
            .then((car) => {
                if (!car) {
                    return res.status(404).json({
                        error: "Car not Found"
                    });
                }
            })
            .catch((error) => {
                console.log("car check error: ", error.message);
                res.status(400).json({
                    error: error.message
                });
            });

        updatedOwnerData.car = car;
    }
    if (email) updatedOwnerData.email = email;



    // update user data
    const owner = await Owner.findByIdAndUpdate(
        ownerID,
        updatedOwnerData,
        { new: true }
    ).catch((error) => {
        res.status(400).json({
            error: error.message
        });
    });

    res.status(200).json(owner);
});

const deleteOwner = asynchandler(async (req, res) => {
    const ownerID = req.user.id;
    const isOwnerIDValid = mongoose.Types.ObjectId.isValid(ownerID);

    if (!isOwnerIDValid) {
        return res.status(400).json({
            error: "Invalid Owner ID"
        });
    }

    // check if owner exist
    await Owner.findById(ownerID)
        .then((owner) => {
            if (!owner) {
                return res.status(404).json({
                    error: "Owner not Found"
                });
            }
        })
        .catch((error) => {
            res.status(400).json({
                error: error.message
            });
        });

    await Owner.findByIdAndDelete(ownerID)

    res.status(200).json({});
});

const loginOwner = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and Password fields are required"
        });
    }

    const user = await Owner.findOne({ email })
        .catch((error) => {
            res.status(400).json({
                error: error.message
            });
        });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(400).json({
            error: "Incorrect Password"
        });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWTSECRET, { expiresIn: '1h' });
    res.status(200).json({
        token: token
    })
});

module.exports = {
    getOwners,
    createOwner,
    getOwner,
    updateOwner,
    partialUpdateOwner,
    deleteOwner,
    loginOwner
};