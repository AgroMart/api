"use strict";

/**
 * loja controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::loja.loja", ({ strapi }) => ({
  async find(ctx) {
    try {
      return await strapi.db.query("api::loja.loja").findMany({
        populate: {
          banner: true,
          endereco: true,
          planos: {
            populate: {
              imagem: {
                populate: true,
              },
            },
          },
          cestas: {
            populate: {
              imagem: {
                populate: true,
              },
            },
          },
          produto_avulsos: {
            populate: {
              imagem: {
                populate: true,
              },
            },
          },
        },
      });
    } catch (err) {
      ctx.throw(500, err);
    }
  },
}));
