const router = require('express').Router();
const bagsController = require('../controller/bags.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

//Get all bags
router.get('/bags', bagsController.getBags);

//Post bags
router.post('/bags', authMiddleware, roleMiddleware('admin', 'superAdmin'), bagsController.postBags);

//Get bags by id
router.get('/bags/:id', bagsController.getBagsId);

//Delete a bag
router.delete('/bags/:id', authMiddleware, roleMiddleware('admin', 'superAdmin'), bagsController.deleteBag);

//Edit a bag
router.put('/bags/:id', authMiddleware, roleMiddleware('admin', 'superAdmin'), bagsController.editBag);

module.exports = router;