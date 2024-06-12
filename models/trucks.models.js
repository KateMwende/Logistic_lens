const { required } = require('joi');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { Bag, bagSchema } = require('./bags.models');

//define truck schema
const truckSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    driver: String,
    number_plate: { type: String, unique: true, required: true },
    destination: String,
    capacityTonnes: { type: Number, required: true }, //Capacity in tonnes
    bags: [bagSchema] // List of bags in the truck
});

//Delete all the bags associated with the truck before deleting truck
truckSchema.pre('findOneAndDelete', async function(next) {
    try {
        const truck = await this.model.findOne(this.getQuery());
        if (truck) {
            await Bag.deleteMany({_id: { $in: truck.bags } })
        }
        next();
    } catch (err) {
        next(err);
    }
});

const Truck = mongoose.model('truck', truckSchema)

module.exports = Truck;