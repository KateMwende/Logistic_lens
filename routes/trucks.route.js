const router = require('express').Router();
const truckController = require('../controller/trucks.controller')

//Get all trucks
router.get('/trucks', truckController.getTrucks);

//Get trucks via id
router.get('/trucks/:id', truckController.getTrucksId)

//Post trucks
router.post('/trucks', truckController.postTrucks);

//Delete a truck by id
router.delete('/trucks/:id', truckController.deleteTruck);

//Edit a truck by id
router.put('/trucks/:id', truckController.editTruck);

module.exports = router;