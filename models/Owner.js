const mongoose = require('mongoose');

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

module.exports = mongoose.model('Owner', OwnerSchema);