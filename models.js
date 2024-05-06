const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
    {
        brand: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const Car = mongoose.model('Car', carSchema);

const OwnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car',
            required: false,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Owner = mongoose.model('Owner', OwnerSchema);

module.exports = { Car, Owner };