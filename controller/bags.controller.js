const Bag = require('../models/bags.models');
const BagDto = require('../dto/bag.dto');

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
    console.error(error);
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
        console.error(error);
    }
}

//Create bags
const postBags = async(req, res) => {
    try {
        const data = req.body;
        const { error } = BagDto.validate(data);
        if (error) return res.status(400).json({ message: error.message });
        const newBag = new Bag(data);
        const savedBag = await newBag.save();
        res.status(200).json(savedBag)
        console.log('Successfully posted a bag')
    } catch (error) {
        console.error(error);
        res.status(404).send('Could not post bag');
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
        console.error('Error deleting bag:', error);
        res.status(404).send('Could not delete bag');
    }
}

//Edit a bag
const editBag = async(req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const { error } = BagDto.validate(data);
        if (error) return res.status(400).json({error: error.message});
        const bag = await Bag.findOneAndUpdate( {id}, { $set: {...data} }, { new: true });
        if (!bag) {
            res.status(404).send('Could not find bag')
        }
        res.status(200).json(bag);
        console.log('Successfully edited bag')
    } catch (error) {
        console.error('Error editing bag:', error);
        res.status(401).send('Could not edit bag');
    }
}

module.exports = { getBags, postBags, getBagsId, deleteBag, editBag };