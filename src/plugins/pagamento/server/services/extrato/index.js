'use strict';

module.exports = ({ strapi }) => ({
  find: async () => {
      const extratos = await strapi.db.query('api::extrato.extrato').findMany({populate: true});
      return extratos
  },
});
