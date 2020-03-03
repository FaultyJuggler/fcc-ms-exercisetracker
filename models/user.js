const mongoose = require( 'mongoose' );

const userSchema = new mongoose.Schema( {
  username: {
    type: String,
    required: true,
    trim: true,
  },
} );

userSchema.methods.toJSON = function()
{
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const User = mongoose.model( 'User', userSchema );
module.exports = User;