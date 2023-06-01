'use strict';

async function defaultGateway() {
  const gateways = await strapi.db.query('plugin::pagamento.gateway').findOne();
  console.log(gateways)
  if (gateways === null) {
    const dadosIniciais = [
      {
        nome: 'PayPall'
      }
    ];

    await strapi.db.query("plugin::pagamento.gateway").createMany({data: dadosIniciais});

    console.log('Content type "Gateway" populado com sucesso.');
  }
}

module.exports = ({ strapi }) => {
    defaultGateway();
};
