const Joi = require('joi');

module.exports = {
  // POST /api/customers
  createCustomer: {
    body: {
      customername: Joi.string().required(),
      location: Joi.string().required()
    }
  },

  // UPDATE /api/customers/:customerId
  updateCustomer: {
    body: {
      customername: Joi.string().required(),
      location: Joi.string().required()
    },
    params: {
      customerId: Joi.string().hex().required()
    }
  }
};
