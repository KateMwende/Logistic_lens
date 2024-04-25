const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

//define truck schema
const truckSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4 },
    driver: String,
    number_plate: { type: String, unique: true }
})

const Truck = mongoose.model('truck', truckSchema)

module.exports = Truck;