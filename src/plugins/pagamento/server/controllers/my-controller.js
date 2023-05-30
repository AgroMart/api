'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('pagamento')
      .service('myService')
      .getWelcomeMessage();
  },
});
