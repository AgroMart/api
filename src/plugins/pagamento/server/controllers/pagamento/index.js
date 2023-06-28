'use strict';

const axios = require('axios');
const gatewayRequests = require('../../utils/gateway');
const xml2js = require('xml2js');

module.exports = ({ strapi }) => ({
  async find(ctx) {
    try {
      const extrato = await strapi
      .plugin('pagamento')
      .service('extrato')
      .find();

      ctx.status = 200;
      ctx.body = extrato;
    } catch (error) {
      ctx.body = {
        message:
          "Ops! Aconteceu tivemos um problema em processar sua requisição.",
        error: error.message,
      };
      ctx.status = 400;
    }
  },
  async link(ctx) {
    try {

      const body = ctx.request.body;
      
      if(body === undefined || Object.keys(body).length === 0 ){
        throw new Error('Body não está definido');
      }

      let pagamento = await strapi
      .plugin('pagamento')
      .service('pagamento')
      .find(body.extrato.id, body.gateway.id);

      if (pagamento != undefined){
        ctx.status = 200;
        ctx.body = pagamento;

      } else {
        const configGateway = gatewayRequests.linkRequest(body.gateway.nome, body);

        let url;

        switch (body.gateway.nome) {
          // case 'Mercado Pago':
          //   await axios(configGateway)
          //   .then(response => {
          //       const code = result.checkout.code;
          //       url = `https://pagseguro.uol.com.br/v2/checkout/payment.html?code=${code}`;
          //     });
          //   })
          //   .catch(error => {
          //     throw new Error(`Aconteceu o erro: ${error}`);
          //   });
          //   break;
          default:
            break;
        }
        let pagamento = await strapi
        .plugin('pagamento')
        .service('pagamento')
        .create(body.extrato.id, body.gateway.id, url);
        console.log(url);

        ctx.status = 200;
        ctx.body = pagamento;
      }
    } catch (error) {
      ctx.body = {
        message:
          "Ops! Aconteceu tivemos um problema em processar sua requisição.",
        error: error.message,
      };
      ctx.status = 400;
    }
  }
});
