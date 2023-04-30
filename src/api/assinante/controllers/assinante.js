'use strict';

/**
 * assinante controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController("api::assinante.assinante", ({ strapi }) =>  ({
    async find(ctx) {
        try {
            const assinantes  = await strapi.db
                                    .query('api::assinante.assinante')
                                    .findMany({populate: true});
            const planos  = await strapi.db
                                    .query('api::plano.plano')
                                    .findMany({populate: true});
          return assinantes;
        } catch (err) {
          ctx.throw(500, err);
        }
    },
    
})
);