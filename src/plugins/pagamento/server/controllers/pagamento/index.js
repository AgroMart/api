'use strict';

module.exports = ({ strapi }) => ({
  async find(ctx) {
    try {
      const extrato = await strapi
      .plugin('pagamento')
      .service('extrato')
      .find();

      ctx.status = 200;
      ctx.body = extrato;
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
