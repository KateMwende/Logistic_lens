const Truck = require('../models/trucks.models')
const mongoose = require('mongoose')
const TruckDto = require('../dto/truck.dto');
const APIError = require('../utils/errors');

//Getting trucks
const getTrucks = async (req, res) => {
    const { driver, number_plate } = req.query;
    const query = {};
    if (driver) {
        query.driver = driver
    }
    if (number_plate) {
        query.number_plate = number_plate;
    }
    try{
        const trucks = await Truck.find(query);
        if (trucks.length === 0) {
            res.status(404).json({ message: 'No trucks found'})
        }
        res.json(trucks);
    }
    catch (error) {
        console.error(error);
    }
};

//Get trucks by Id
const getTrucksId = async(req, res) => {
  try { 
    const id = req.params.id;
    //find by id
    const truck = await Truck.findOne({ id: id });
    //Search for the truck
    console.log('Searching for truck with ID:', id);
    if (!truck) {
        res.status(404).send('Could not find truck')
        return;
    }
    console.log('Truck found:', truck);
    res.json({
        id: truck.id,
        driver: truck.driver,
        number_plate: truck.number_plate
    });
  }catch (error) {
        console.log(error)
        res.status(500).send('Error finding truck by ID')
    }
}

//Posting Trucks 
const postTrucks = async (req, res, next) => {
    try{
        const data = req.body;
        const { error } = TruckDto.validate(data, { abortEarly: false });
        if (error) throw new APIError(error.message, 400);
        const newTruck = new Truck(data);
        const savedTruck = await newTruck.save();
        res.status(200).json(savedTruck);
        console.log('Successfully posted a truck', savedTruck);
    }
    catch (error) {
        console.log(error);
        if (error.name === 'MongoError' && error.code === 11000) {
            // Duplicate key error (number plate already exists)
            const apiError = new APIError('Number plate already exists', 400);
            next(apiError);
        } else if (error instanceof APIError) {
            next(error);
        } else {
            next(new APIError('Server error', 500));
        }
    }
}

//Delete a truck
const deleteTruck = async(req, res) => {
  try {
    const id = req.params.id;
    // Find and delete the truck
    const truck = await Truck.findOneAndDelete({ id: id});
    //Success of deletion
    console.log('Successfully deleted truck', truck);
    res.status(200).send('Truck deleted successfully');
  } catch (error) {
    console.log(error);
    res.status(401).send('Could not delete truck');
  }
}

//Edit truck
const editTruck = async(req, res, next) => {
   try {
      const { id } = req.params;
      const data = req.body;
      const { error } = TruckDto.validate(data, { abortEarly: true });
      if (error) throw new APIError(error.message, 400)
      //find truck, update the request body and return edited document
      const truck = await Truck.findOneAndUpdate( {id}, { $set: { ...data } }, { new: true} );
      //If truck is not found
      if (!truck) {
        res.status(404).send('Could not find truck');
      }
      //Successful editing
      console.log('Successfully edited truck');
      res.status(200).json(truck)
   }catch (error) {
      console.log(error);
      if (error instanceof APIError) next(error);
      next(new APIError('Server error'));
   }
}

module.exports = { getTrucks, postTrucks, getTrucksId, deleteTruck, editTruck };