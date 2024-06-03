const router = require('express').Router();
const authController = require('../controller/auth.controller');

//Get signup page
router.get('/signup', authController.getSignup);

//Post signup details
router.post('/register', authController.createUser);

//Login a user
router.post('/login', authController.loginUser);

module.exports = router;