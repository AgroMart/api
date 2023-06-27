'use strict';

/**
 * extrato service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::extrato.extrato', ({ strapi }) => ({
    create: async (data) => {
      const extratos = await strapi.db.query('api::extrato.extrato')
      .create({
        populate: ['itens', 'itens.produto_avulso', 'itens.plano'],
        data: data});
      return extratos;
    }
  })
);
