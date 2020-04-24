const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const Customer = mongoose.model(
  'Customer',
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
      },
      phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 20
      },
      isGold: {
        type: Boolean,
        default: false
      }
    },
    { timestamps: true }
  )
);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(40).required(),
    phone: Joi.string().min(5).max(20).required(),
    isGold: Joi.boolean()
  });
  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
