const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Car, Owner } = require('./models');


const dBUri = 'mongodb://localhost:27017/techyjauntcars';
const port = 4500;
const app = express();
app.use(bodyParser.json());

mongoose.connect(dBUri)
    .then(() => {
        console.log('Connected to MongoDB...')
    })
    .catch((err) => {
        console.log('Failed to connect to MongoDB...', err)
    });

app.get('/cars/', async (req, res) => {
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

app.post('/cars/', async (req, res) => {
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

app.get('/cars/:id/', async (req, res) => {
    carId = req.params.id;

    await Car.findById(carId)
        .then((car) => {
            res.status(200).json(car);
        })
        .catch((error) => {
            res.status(400).json({
                error: error.message
            })
        });
});

app.put('/cars/:id/', async (req, res) => {
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

app.delete('/cars/:id/', async (req, res) => {
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

app.get('/owners/', async (req, res) => { 
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
 
app.post('/owners/', async (req, res) => {
    const { name, car } = req.body;

    // Check if name is provided
    if (!name) {
        return res.status(400).json({
            error: "Name field is required"
        });
    }

    // Set carID to null if car is not provided, else assign the provided car
    const carID = car || null;

    try {
        // Create a new owner instance
        const newOwner = new Owner({
            name,
            car: carID
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



app.listen(port, () => {
    console.log(`The server is running on port: ${port}...`)
});