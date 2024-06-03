const User = require('../models/user.models');
const APIError = require('../utils/errors');
const logger = require('../logger');
const UserDto = require('../dto/user.dto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}

const getSignup = (req, res) => {
    res.json({ message: "Signup endpoint. Please POST your user data to /register." });
}

const createUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      //Validate the data
       const { error } = UserDto.validate(req.body, { abortEarly:  false } );
       if (error) throw new APIError(error.message, 400)
      //Create the new user
       const newUser = new User({email, password});
       //Save User to DB
       const savedUser = await newUser.save();
      //Successful creation 
       console.log('Successfully created user', savedUser);
       res.status(200).json({ message: 'Successfully created user', savedUser});
    } catch (error) {
        logger.error(error.stack);
        let thrownError = error;
        if (!(error instanceof APIError))
            thrownError = new Error('Internal Server error');
        next(thrownError);

    }
}

//Login a user
const loginUser = async(req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        console.log('Successfully logged in', user);
        res.status(200).json({ user, token });
    } catch (error) {
        logger.error(error.stack);
        let thrownError = error;
        if (!(error instanceof APIError))
            thrownError = new Error('Internal Server error');
        next(thrownError);
    }
}

module.exports = { createUser, getSignup, loginUser};