'use strict';

/**
 * extrato controller
 */
const { transformObjectKeys } = require('../../../middlewares/helpers/transformObject')
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::extrato.extrato', ({ strapi }) =>  ({
    async find(ctx) {
        try {
          const { usuario: id } = ctx.request.query;

          let extratos;
          if (id){
            extratos  = await strapi.db
                                    .query('api::extrato.extrato')
                                    .findMany({filters: { id },populate: true});
          } else{
            extratos  = await strapi.db
                                      .query('api::extrato.extrato')
                                      .findMany({populate: true});
          }

          return extratos.map((extrato) => (
            transformObjectKeys(extrato)
          ));;
        } catch (err) {
          ctx.throw(500, err);
        }
    },
})
);
