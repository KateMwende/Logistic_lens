const Truck = require('../models/trucks.models')
const mongoose = require('mongoose')
const TruckDto = require('../dto/truck.dto');
const APIError = require('../utils/errors');
const logger = require('../logger');

//Getting trucks
const getTrucks = async (req, res, next) => {
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
            throw new APIError('No truck found', 404);
        }
        res.json(trucks);
    }
    catch (error) {
        logger.error(error.stack);
        let thrownError = error;
        if(!(error instanceof APIError))
            thrownError = new Error('Internal server error', 500);
        next(thrownError);
    }
};

//Get trucks by Id
const getTrucksId = async(req, res, next) => {
  try { 
    const id = req.params.id;
    //find by id
    const truck = await Truck.findOne({ id: id });
    if (!truck) {
        throw new APIError('No truck found', 404)
        return;
    }
    res.json({truck});
  }catch (error) {
        logger.error(error.stack); 
        let thrownError = error;
        if(!(error instanceof APIError))
            thrownError = new Error('Internal server error', 500);
        next(thrownError);
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
        logger.error(error.stack);
        if (error.name === 'MongoError' && error.code === 11000) {
            // Duplicate key error (number plate already exists)
            const apiError = new APIError('Number plate already exists', 400);
            next(apiError);
        } else if (error instanceof APIError) {
            next(error);
        } else {
            next(new Error('Internal server error'));
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
    res.status(200).send('Successfuly deleted truck');
  } catch (error) {
    logger.error(error.message);
    let thrownError = error;
    if(!(error instanceof APIError))
        next(new Error('Internal server error'));
    next(thrownError);
  }
}

//Edit truck
const editTruck = async(req, res, next) => {
   try {
      const { id } = req.params;
      const data = req.body;
      const { error } = TruckDto.validate(data, { abortEarly:  false } );
      if (error) throw new APIError(error.message, 400)
      //find truck, update the request body and return edited document
      const truck = await Truck.findOneAndUpdate( {id}, { $set: { ...data } }, { new: true} );
      //If truck is not found
      if (!truck) {
        throw new APIError('Could not find truck', 404);
      }
      //Successful editing
      res.status(200).json(truck);
      console.log('Successfully edited truck');
   }catch (error) {
      logger.error(error.message);
      if (!(error instanceof APIError)) 
        next(new Error('Internal server error'));
      next(thrownError);
   }
}

module.exports = { getTrucks, postTrucks, getTrucksId, deleteTruck, editTruck };