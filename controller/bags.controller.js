const Bag = require('../models/bags.models');
const BagDto = require('../dto/bag.dto');
const APIError = require('../utils/errors');
const logger = require('../logger');

//Get bags
const getBags = async (req, res, next) => {
    try {
        const { weight, units, truck_id, description } = req.query;
        const query = {};
        if (weight) {
            query.weight = weight;
        }
        if (description) {
            query.description = description;
        }
        if (units) {
            query.units = units;
        }
        if (truck_id) {
            query.truck_id = truck_id;
        }
        const bags = await Bag.find(query);
        if (bags.length === 0) {
            throw new APIError('No bags found', 404);
        }
        res.json(bags);
    } catch (error) {
        logger.error(error.stack);
        let thrownError = error;
        if (!(error instanceof APIError))
            thrownError = new Error('Internal Server error');
        next(thrownError);
    }
}

//Get bags by Id
const getBagsId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const bag = await Bag.findOne({ id: id });
        if (!bag) {
            throw new APIError('Could not find bag', 404)
            return;
        }
        console.log('Bag found:', bag);
        res.json(bag)
    } catch (error) {
        logger.error(error.stack);
        let thrownError = error;
        if (!(error instanceof APIError))
            thrownError = new Error('Internal Server error');
        next(thrownError);
    }
}

//Create bags
const postBags = async (req, res, next) => {
    try {
        const data = req.body;
        const { error } = BagDto.validate(data, { abortEarly: false });
        if (error) throw new APIError(error.message, 400, error.stack);
        const newBag = new Bag(data);
        const savedBag = await newBag.save();
        res.status(200).json(savedBag);
        console.log('Successfully posted a bag', savedBag);
    } catch (error) {
        logger.error(error.stack);
        let thrownError = error;
        if (!(error instanceof APIError))
            thrownError = new Error('Internal Server error');
        next(thrownError);
    }
}

//Delete a bag
const deleteBag = async (req, res, next) => {
    try {
        const id = req.params.id;
        const bag = await Bag.findOneAndDelete({ id: id });
        if (!bag) {
            throw new APIError('Could not find bag', 404);
        }
        //Deletion success
        console.log('Successfully deleted bag:', bag);
        res.status(200).send('Bag deleted successfully');
    } catch (error) {
        logger.error(error.stack);
        let thrownError = error;
        if (!(error instanceof APIError))
            thrownError = new Error('Internal server error')
        next(thrownError);
    }
}

//Edit a bag
const editBag = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const { error } = BagDto.validate(data, { abortEarly: false });
        if (error) throw new APIError(error.message, 400);
        const bag = await Bag.findOneAndUpdate({ id }, { $set: { ...data } }, { new: true });
        if (!bag) {
            throw new APIError('Could not find bag', 404);
        }
        res.status(200).json(bag);
        console.log('Successfully edited bag');
    } catch (error) {
        logger.error(error.stack);
        let thrownError = error;
        if (!(error instanceof APIError))
            thrownError = new Error('Internal server error')
        next(thrownError);
    }
}

module.exports = { getBags, postBags, getBagsId, deleteBag, editBag };