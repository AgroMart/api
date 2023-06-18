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
          ));
        } catch (err) {
          ctx.throw(500, err);
        }
    },
    async create(ctx) {
      try {
        const body = ctx.request.body.data;

        let itens_id = [];

        await Promise.all(
          body.itens.produtos.map(async (item) => {
            const produto = await strapi.db.query("api::produto-avulso.produto-avulso").create({ data: { nome: item.produto }});
            const data = await strapi.db.query("api::item.item").create({ data: {
              produto_avulso: produto.id,
              quantidade: item.quantidade,
              valor: item.valor
            }});
            itens_id.push(data.id);
          })
        );

        const data = await strapi.service("api::extrato.extrato").create({
          data: {
            valor: body.valor,
            user: body.user,
            loja: body.loja,
            pagamento_realizado: body.pagamento_realizado,
            itens: itens_id
          }
        });

        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },
  })
);
