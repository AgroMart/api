'use strict';

module.exports = ({ strapi }) => ({
  find: async () => {
      const extratos = await strapi.db.query('api::extrato.extrato')
      .findMany({
        fields: ['valor', 'itens'],
        populate: ['user', 'itens', 'itens.produto_avulso', 'itens.plano'],
        where: { pagamento_realizado: false }});

      const filteredData = extratos.map(obj => {
        const { id, valor, entregue, tipo_de_entrega, pagamento_realizado, createdAt, updatedAt, publishedAt, user, itens } = obj;
        const filteredUser = { username: user.username, email: user.email };
        return { id, valor, entregue, tipo_de_entrega, pagamento_realizado, createdAt, updatedAt, publishedAt, user: filteredUser, itens };
      });

      return filteredData;
  },
  findOne: async (id) => {
    const extratos = await strapi.db.query('api::extrato.extrato')
    .findMany({
      fields: ['valor', 'itens'],
      populate: ['user', 'itens', 'itens.produto_avulso', 'itens.plano'],
      where: { id: id }});

    const filteredData = extratos.map(obj => {
      const { id, user, itens } = obj;
      const filteredUser = { username: user.username, email: user.email };
      return { id, user: filteredUser, itens };
    });

    return filteredData;
}
});
