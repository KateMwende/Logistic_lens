const router = require('express').Router();
const bagsController = require('../controller/bags.controller');
const authMiddleware = require('../middleware/authMiddleware');

//Get all bags
router.get('/bags', bagsController.getBags);

//Post bags
router.post('/bags', authMiddleware, bagsController.postBags);

//Get bags by id
router.get('/bags/:id', bagsController.getBagsId);

//Delete a bag
router.delete('/bags/:id', authMiddleware, bagsController.deleteBag);

//Edit a bag
router.put('/bags/:id', authMiddleware, bagsController.editBag);

module.exports = router;