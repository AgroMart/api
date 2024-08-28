'use strict';

/**
 *  router.
 */

module.exports = {
  type: 'admin', // other type available: content-api.
  routes: [
    {
      method: 'GET',
      path: '/gateway',
      handler: 'gateway.find',
      config: {
        policies: [],
        auth: false,
      },
    },    
    {
      method: 'GET',
      path: '/gateway/ativado',
      handler: 'gateway.ativado',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/gateway/:id',
      handler: 'gateway.findOne',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/gateway/:id',
      handler: 'gateway.update',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/gateway',
      handler: 'gateway.create',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
