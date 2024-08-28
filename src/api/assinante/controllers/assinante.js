'use strict';

/**
 * assinante controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController("api::assinante.assinante", ({ strapi }) =>  ({
    async find(ctx) {
        try {
          const { usuario: id } = ctx.request.query;

          let assinantes;
          if (id){
            assinantes  = await strapi.db
                                    .query('api::assinante.assinante')
                                    .findMany({filters: { id },populate: true});
          } else{
            assinantes  = await strapi.db
                                      .query('api::assinante.assinante')
                                      .findMany({populate: true});
          }
          return assinantes.map((assinante) => ({
            nome: assinante?.nome,
            id: assinante.id,
            cestas_disponiveis: assinante.cestas_disponiveis,
            pular_cesta: assinante.pular_cesta,
            planos: assinante.planos.map((plano) => ({
              quantidade_de_cestas: plano.quantidade_de_cestas,
              imagem: plano.imagem,
              valor: plano.valor,
              nome: plano.nome,
              descricao: plano.descricao,
              loja: plano.loja,
            })),
            created_at: assinante.createdAt,
          }));
        } catch (err) {
          ctx.throw(500, err);
        }
    },
    
})
);