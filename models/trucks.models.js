const { required } = require('joi');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { bagSchema } = require('./bags.models');

//define truck schema
const truckSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    driver: String,
    number_plate: { type: String, unique: true, required: true },
    capacityTonnes: { type: Number, required: true }, //Capacity in tonnes
    bags: [bagSchema] // List of bags in the truck
});

const Truck = mongoose.model('truck', truckSchema)

module.exports = Truck;