const Truck = require('../models/trucks.models')
const mongoose = require('mongoose')
const TruckDto = require('../dto/truck.dto');
const APIError = require('../utils/errors');
const logger = require('../logger');
const { Bag } = require('../models/bags.models');
//Getting trucks
const getTrucks = async (req, res, next) => {
    const { driver, number_plate, destination } = req.query;
    const query = {};
    if (driver) {
        query.driver = driver
    }
    if (number_plate) {
        query.number_plate = number_plate;
    }
    if (destination) {
        query.destination = destination;
    }
    try{
        const trucks = await Truck.find(query);
        if (trucks.length === 0) {
            throw new APIError('No truck found', 404);
        }
        res.status(200).json({"trucks": trucks});
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
    const truck = await Truck.findById(id);
    if (!truck) {
        throw new APIError('No truck found', 404)
        return;
    }
    console.log('Truck found:', truck);
    res.status(200).json({truck});
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
        console.log('Successfully posted a truck', savedTruck);
        res.status(200).json({ success: 'Successfully posted a truck', savedTruck });
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
const deleteTruck = async(req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const id = req.params.id;
    // Find the truck
    const truck = await Truck.findOne({_id: id}).session(session);
    if (!truck) {
        throw new APIError('Could not find truck', 404);
    }
    // Delete all bags associated with the truck
    await Bag.deleteMany({ truck_id: id }).session(session);

    // Delete the truck
    await Truck.findOneAndDelete({ _id: id }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    //Success of deletion
    console.log('Successfully deleted truck', truck);
    res.status(200).json({ success: 'Successfully deleted truck', truck });
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
      const id = req.params.id;
      const data = req.body;
      const { error } = TruckDto.validate(data, { abortEarly:  false } );
      if (error) throw new APIError(error.message, 400)
      //find truck, update the request body and return edited document
      const truck = await Truck.findOneAndUpdate( { _id: id }, { $set: { ...data } }, { new: true} );
      console.log(truck);
      //If truck is not found
      if (!truck) {
        throw new APIError('Could not find truck', 404);
      }
      //Successful editing
      console.log('Successfully edited truck', truck);
      res.status(200).json({ message: 'Successfully edited truck', truck });
   }catch (error) {
      logger.error(error.message);
      let thrownError = error;
      if (!(error instanceof APIError)) 
        next(new Error('Internal server error'));
      next(thrownError);
   }
}

module.exports = { getTrucks, postTrucks, getTrucksId, deleteTruck, editTruck };