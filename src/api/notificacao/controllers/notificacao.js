'use strict';

/**
 * A set of functions called "actions" for `devices`
 */

module.exports = {
  
  async find(ctx, next) {
    try {
      const data = await strapi
        .service("api::notificacao.notificacao")
        .find();

      if (data) {
        ctx.status = 200;
        ctx.body = data;
      } else {
        ctx.body = { mensagem: "Não foi encontrado nenhuma notificação", status: 404 };
      }
    } catch (error) {
      ctx.body = {
        message:
          "Ops! Aconteceu tivemos um problema em processar sua requisição.",
        error: error.message,
      };
      ctx.status = 400;
    }
  },
};
