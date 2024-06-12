const router = require('express').Router();
const truckController = require('../controller/trucks.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

//Get all trucks
router.get('/trucks', truckController.getTrucks);

//Get trucks via id
router.get('/trucks/:id', truckController.getTrucksId)

//Post trucks
router.post('/trucks', authMiddleware, roleMiddleware('admin', 'superAdmin'), truckController.postTrucks);

//Delete a truck by id
router.delete('/trucks/:id', authMiddleware, roleMiddleware('admin', 'superAdmin'), truckController.deleteTruck);

//Edit a truck by id
router.put('/trucks/:id', authMiddleware, roleMiddleware('admin', 'superAdmin'), truckController.editTruck);

module.exports = router;