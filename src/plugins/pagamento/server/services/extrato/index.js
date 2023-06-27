'use strict';

module.exports = ({ strapi }) => ({
  find: async () => {
      const extratos = await strapi.db.query('api::extrato.extrato')
      .findMany({
        populate: ['user', 'itens', 'itens.produto_avulso', 'itens.plano'],
        where: { pagamento_realizado: false }});
      return extratos
  }
});
