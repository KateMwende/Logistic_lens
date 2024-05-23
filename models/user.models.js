const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//define user schema
const userSchema = new mongoose.schema({
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
    }
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const User = mongoose.model('user', userSchema);

module.exports = User;