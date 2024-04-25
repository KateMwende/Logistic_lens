const Truck = require('../models/trucks.models')
const mongoose = require('mongoose')
const TruckDto = require('../dto/truck.dto');

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
        console.error('Error finding truck by ID', error)
        res.status(500).send('Error finding truck by ID')
    }
}

//Posting Trucks 
const postTrucks = async (req, res) => {
    try{
        const data = req.body;
        const { error } = TruckDto.validate(data);
        if (error) return res.status(400).json({ error: error.message })
        const newTruck = new Truck(data)
        const savedTruck = await newTruck.save();
        res.status(200).json(savedTruck);
        console.log('Successfully posted a truck')
    }
    catch(error) {
        console.error('Error posting trucks');
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
    console.error('Error deleting truck:', error);
    res.status(401).send('Could not delete truck');
  }
}

//Edit truck
const editTruck = async(req, res) => {
   try {
      const { id } = req.params;
      const data = req.body;
      const { error } = TruckDto.validate(data);
      if (error) return res.status(400).json({error: message});
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
      console.error('Error editing truck:', error);
      res.status(401).send('Could not edit truck');
   }
}

module.exports = { getTrucks, postTrucks, getTrucksId, deleteTruck, editTruck };