'use strict';

/**
 * A set of functions called "actions" for `devices`
 */

module.exports = {
  
  async update(ctx, next) {
    try {
      const { body } = ctx.request.body;
      const data = await strapi
        .service("api::devices.devices")
        .update(body);
      console.log(data, "data");

      ctx.body = data;
    } catch (err) {
      ctx.badRequest("PUT devices error", { moreDetails: err });
    }
  },
  async findUserExpoPushToken(ctx, next) {
    try {
      const { user_id } = ctx.params;
      const data = await strapi
        .service("api::devices.devices")
        .findUserExpoPushToken(user_id);
      console.log(data, "data");

      if (data) {
        ctx.status = 200;
        ctx.body = {
          mensagem: "Device encontrado!",
          device_id: data,
          status: 200,
        };
      } else {
        ctx.body = { mensagem: "Device não encontrado!", status: 404 };
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
