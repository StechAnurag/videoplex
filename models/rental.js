const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const Rental = mongoose.model(
  'Rental',
  new mongoose.Schema(
    {
      customer: {
        type: new mongoose.Schema({
          name: {
            type: String,
            minlength: 3,
            maxlength: 50,
            required: true,
            trim: true
          },
          phone: {
            type: String,
            minlength: 5,
            maxlength: 20,
            required: true,
            trim: true
          },
          isGold: {
            type: Boolean,
            default: false
          }
        }),
        required: true
      },
      movie: {
        type: new mongoose.Schema({
          title: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true,
            trim: true
          },
          dailyRentalRate: {
            type: Number,
            min: 0,
            maxlength: 500,
            required: true,
            get: val => Math.round(val),
            set: val => Math.round(val)
          }
        }),
        required: true
      },
      dateOut: {
        type: Date,
        required: true,
        default: Date.now
      },
      dateReturned: {
        type: Date
      },
      rentalFee: {
        type: Number,
        min: 0,
        get: val => Math.round(val),
        set: val => Math.round(val)
      }
    },
    {
      timestamps: true
    }
  )
);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });
  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validateRental = validateRental;
