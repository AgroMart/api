'use strict';

/**
 * A set of functions called "actions" for `devices`
 */

module.exports = {
  
  async update(ctx, next) {
    try {
      const { body } = ctx.request.body;
      if(body === undefined || 
        body.user_id === undefined || 
        body.expo_push_token === undefined){
        throw new Error('Body não está definido');
      }
      const data = await strapi
        .service("api::devices.devices")
        .update(body);

      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Devices error", { moreDetails: err });
    }
  },
  async findUserExpoPushToken(ctx, next) {
    try {
      const { user_id } = ctx.params;
      const data = await strapi
        .service("api::devices.devices")
        .findUserExpoPushToken(user_id);

      if (data.expoPushToken) {
        ctx.status = 200;
        ctx.body = {
          mensagem: "Device encontrado!",
          device_id: data.expoPushToken,
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
