const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    }
});

//hash password before saving to DB
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//Method to log in a user
userSchema.statics.login = async (email, password) => {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await  bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;