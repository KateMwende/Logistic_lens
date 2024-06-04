const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const APIError = require('../utils/errors');

//define user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [ true, 'Please enter email address'],
        unique: true,
        lowercase: true
    },
    password: {
       type: String,
       required: [true, 'Please enter a password'],
       minlength: [6, 'Minimum password length is 6 characters']
    },
    role: {
      type: String,
      enum: [ 'user', 'admin', 'superAdmin' ],
      default: 'user'
    }
});

//hash password before saving to DB
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//Method to log in a user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await  bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw new APIError('Incorrect password', 401);
    }
    throw new APIError('Incorrect email', 401);
}

const User = mongoose.model('user', userSchema);

module.exports = User;