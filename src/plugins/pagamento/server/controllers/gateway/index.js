'use strict';
const axios = require('axios');
const gatewayRequests = require('../../utils/gateway');

module.exports = ({ strapi }) => ({
  async find(ctx) {
    try {
      const gateways = await strapi
      .plugin('pagamento')
      .service('gateway')
      .find();

      ctx.status = 200;
      ctx.body = gateways;
    } catch (error) {
      ctx.body = {
        message:
          "Ops! Aconteceu tivemos um problema em processar sua requisição.",
        error: error.message,
      };
      ctx.status = 400;
    }
  },
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const gateways = await strapi
      .plugin('pagamento')
      .service('gateway')
      .findOne(id);

      ctx.status = 200;
      ctx.body = gateways;
    } catch (error) {
      ctx.body = {
        message:
          "Ops! Aconteceu tivemos um problema em processar sua requisição.",
        error: error.message,
      };
      ctx.status = 400;
    }
  },
  async update(ctx){
    try {
      const body = ctx.request.body;
      
      if(body === undefined || Object.keys(body).length === 0 ){
        throw new Error('Body não está definido');
      }

      if (body.ativado){
        const configGateway = gatewayRequests.authRequest(body.nome, body);
        if (configGateway){
          try {
            const res = await axios(configGateway);
            body.token = res.access_token;
          } catch (error) {
            throw new Error(`Erro em validar credenciais! Verifique as informações`);
          }
        }
      }

      const { id } = ctx.params;
      if(body.id != id){
        throw new Error('Diferentes tipos de id!');
      }

      const gateways = await strapi
        .plugin('pagamento')
        .service('gateway')
        .update(id, body);

      ctx.status = 200;
      ctx.body = gateways;

    } catch (error) {
      ctx.body = {
        message:
          "Ops! Aconteceu tivemos um problema em processar sua requisição.",
        error: error.message,
      };
      ctx.status = 400;
    }
  },
  async create(ctx){
    try {
      const body = ctx.request.body;
      
      if(body === undefined || Object.keys(body).length === 0 ){
        throw new Error('Body não está definido');
      }

      const gateways = await strapi
        .plugin('pagamento')
        .service('gateway')
        .create(body);

      ctx.status = 200;
      ctx.body = gateways;

    } catch (error) {
      ctx.body = {
        message:
          "Ops! Aconteceu tivemos um problema em processar sua requisição.",
        error: error.message,
      };
      ctx.status = 400;
    }
  },
});
