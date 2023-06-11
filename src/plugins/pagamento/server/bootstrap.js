'use strict';

async function defaultGateway() {
  const gateways = await strapi.db.query('plugin::pagamento.gateway').findOne();
  if (gateways === null) {
    const dadosIniciais = [
      {
        nome: 'PayPal'
      },
      {
        nome: 'Mercado Pago'
      },
      {
        nome: 'PagSeguro'
      }
    ];

    await strapi.db.query("plugin::pagamento.gateway").createMany({data: dadosIniciais});
  }
}

module.exports = ({ strapi }) => {
    defaultGateway();
};
