const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    genre: {
      type: genreSchema,
      required: true
    },
    numberInStock: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
      max: 255,
      set: val => Math.round(val),
      get: val => Math.round(val)
    },
    dailyRentalRate: {
      type: Number,
      default: 0,
      required: true,
      validate: {
        validator: function (val) {
          return val > 0;
        },
        message: 'Daily Rental Rate should be non negative'
      },
      set: val => Math.round(val),
      get: val => Math.round(val)
    }
  },
  {
    timestamps: true
  }
);

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(Movie) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(40).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required()
  });
  return schema.validate(Movie);
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;
