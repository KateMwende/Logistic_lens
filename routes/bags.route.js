const router = require('express').Router();
const bagsController = require('../controller/bags.controller')

//Get all bags
router.get('/bags', bagsController.getBags);

//Post bags
router.post('/bags', bagsController.postBags);

//Get bags by id
router.get('/bags/:id', bagsController.getBagsId);

//Delete a truck
router.delete('/bags/:id', bagsController.deleteBag);

//Edit a bag
router.put('/bags/:id', bagsController.editBag);

module.exports = router;