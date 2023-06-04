'use strict';

module.exports = ({ strapi }) => ({
  find: async () => {
        const gateways = await strapi.db.query('plugin::pagamento.gateway').findMany();
        return gateways
  },
  findOne: async (id) => {
    const gateways = await strapi.db.query('plugin::pagamento.gateway').findOne({
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
});
