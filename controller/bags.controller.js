const Bag = require('../models/bags.models');
const BagDto = require('../dto/bag.dto');
const APIError = require('../utils/errors');
const logger = require('../logger');

//Get bags
const getBags = async(req, res) => {
  const { weight, units, truck_id } = req.query;
  const query = {};
  if (weight) {
    query.weight = weight;
  }
  if (units) {
    query.units = units;
  }
  if (truck_id) {
    query.truck_id = truck_id;
  }
  try {
    const bags = await Bag.find(query);
    if (bags.length === 0) {
        res.status(404).json({ message: 'No bags found'});
    }
    res.json(bags);
  } catch (error) {
    logger.error(error.message);
  }
}

//Get bags by Id
const getBagsId = async(req, res) => {
    try {
        const id = req.params.id;
        const bag = await Bag.findOne({ id: id });
        console.log('Searching for bag with Id:', id);
        if (!bag) {
            res.status(404).send('Could not find bag')
            return;
        }
        console.log('Bag found:', bag);
        res.json(bag)
    } catch (error) {
        logger.error(error.message);
    }
}

//Create bags
const postBags = async(req, res, next) => {
    try {
        const data = req.body;
        const { error } = BagDto.validate(data, { abortEarly: false });
        if (error) throw new APIError(error.message, 400);
        const newBag = new Bag(data);
        const savedBag = await newBag.save();
        res.status(200).json(savedBag);
        console.log('Successfully posted a bag', savedBag);
    } catch (error) {
        logger.error(error.message);
        if (error instanceof APIError) next(error);
        next(new APIError('Server error'));
    }
}

//Delete a bag
const deleteBag = async(req, res) => {
    try {
        const id = req.params.id;
        const bag = await Bag.findOneAndDelete({ id: id });
        //Deletion success
        console.log('Successfully deleted bag:', id);
        res.status(200).send('Truck deleted successfully');
    } catch (error) {
        logger.error(error.message);
        console.log('Error deleting bag:', error);
        res.status(404).send('Could not delete bag');
    }
}

//Edit a bag
const editBag = async(req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const { error } = BagDto.validate(data, { abortEarly: true });
        if (error) throw new APIError(error.message, 400);
        const bag = await Bag.findOneAndUpdate( {id}, { $set: {...data} }, { new: true });
        if (!bag) {
            res.status(404).send('Could not find bag')
        }
        res.status(200).json(bag);
        console.log('Successfully edited bag')
    } catch (error) {
        logger.error(error.message);
        if (error instanceof APIError) next(error);
        next(new APIError('Server error'));
    }
}

module.exports = { getBags, postBags, getBagsId, deleteBag, editBag };