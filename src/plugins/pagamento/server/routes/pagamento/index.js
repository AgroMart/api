'use strict';

/**
 *  router.
 */

module.exports = {
  type: 'admin', // other type available: content-api.
  routes: [
    {
      method: 'GET',
      path: '/pagamento',
      handler: 'pagamento.find',
      config: {
        policies: [],
        auth: false,
      },
    }
  ],
};
