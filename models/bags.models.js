const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Truck = require('./trucks.models');

//define a bags schema
const bagSchema = new mongoose.Schema({
    description: { type: String, required: true },
    _id: { type: String, default: uuidv4 },
    weight: Number,
    units: { type: String, enum: ['kgs', 'ton'], required: true },
    truck_id: { type: mongoose.Schema.Types.String, ref: 'Truck',  required: true } // Link to truck
});

const Bag = mongoose.model('bag', bagSchema);

module.exports = { Bag, bagSchema }