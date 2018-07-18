const Joi = require('joi');

module.exports = {
  // POST /api/banks
  createBank: {
    body: {
      bankname: Joi.string().required(),
      location: Joi.string().required()
    }
  },

  // UPDATE /api/banks/:bankId
  updateBank: {
    body: {
      bankname: Joi.string().required(),
      location: Joi.string().required()
    },
    params: {
      bankId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      bankname: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
