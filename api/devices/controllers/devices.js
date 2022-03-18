"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findUserDevice(ctx) {
    try {
      const { user_id } = ctx.params;

      const device = await strapi.db
        .query("devices")
        .findOne({ user_fk: user_id });

      if (device) {
        ctx.status = 200;
        ctx.body = { mensagem: "Device encontrado!", device_id: device.id, status: 200 };
      } else {
        ctx.body = { mensagem: "Device não encontrado!", status: 404};
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
