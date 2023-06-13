'use strict';

module.exports = ({ strapi }) => ({
  async find(ctx) {
    try {
      const extratoes = await strapi
      .plugin('pagamento')
      .service('extratoes')
      .find();

      ctx.status = 200;
      ctx.body = extratoes;
    } catch (error) {
      ctx.body = {
        message:
          "Ops! Aconteceu tivemos um problema em processar sua requisição.",
        error: error.message,
      };
      ctx.status = 400;
    }
  },
});
