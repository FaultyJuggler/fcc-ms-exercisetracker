const mongoose = require( 'mongoose' );

const exerciseSchema = new mongoose.Schema( {
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
  },
} );

exerciseSchema.methods.toJSON = function()
{
  const obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
};

const Exercise = mongoose.model( 'Exercise', exerciseSchema );
module.exports = Exercise;