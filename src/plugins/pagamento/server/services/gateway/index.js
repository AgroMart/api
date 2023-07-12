'use strict';

module.exports = ({ strapi }) => ({
  find: async () => {
        const gateways = await strapi.db.query('plugin::pagamento.gateway').findMany(
          {
            fields: ['nome']
          }
        );
        return gateways
  },
  ativado: async () => {
    const gateways = await strapi.db.query('plugin::pagamento.gateway').findMany({
      fields: ['nome'],
      where: { ativado: true }
      });
    return gateways
  },
  findGateway: async (nome) => {
    const gateways = await strapi.db.query('plugin::pagamento.gateway').findOne({
      where: { nome: nome }
      });
    return gateways
  },
  findOne: async (id) => {
    const gateways = await strapi.db.query('plugin::pagamento.gateway').findOne({
      fields: ['nome'],
      where: { id: id }
      });
    return gateways
  },
  update: async (id, body) => {
    try {
        const gateway = await strapi.db.query('plugin::pagamento.gateway').update({
            where: { id: id },
            data: body,
          });
        return gateway;
    } catch (error) {
        return error;
    }
  },
  create: async (body) => {
    try {
        const gateway = await strapi.db.query('plugin::pagamento.gateway').create({
            data: body,
          });
        return gateway;
    } catch (error) {
        return error;
    }
  },
});
