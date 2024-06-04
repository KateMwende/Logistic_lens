const User = require('../models/user.models');
const APIError = require('../utils/errors');
const logger = require('../logger');
const UserDto = require('../dto/user.dto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
    return jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}

const getSignup = (req, res) => {
    res.json({ message: "Signup endpoint. Please POST your user data to /register." });
}

const createUser = async (req, res, next) => {
    const { email, password, role } = req.body;
    try {
      //Validate the data
       const { error } = UserDto.validate(req.body, { abortEarly:  false } );
       if (error) throw new APIError(error.message, 400)
      //Create the new user
       const newUser = new User({email, password, role});
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
        const token = createToken(user);
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

// Logout a user
const logoutUser = (req, res) => {
    res.status(200).json({ success: 'Successfully logged out' });
};

const listUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password field
        res.status(200).json(users);
    } catch (error) {
        next(new APIError('Failed to retrieve users', 500));
    }
};

module.exports = { createUser, getSignup, loginUser, logoutUser, listUsers};