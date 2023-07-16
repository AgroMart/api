"use strict";

const axios = require("axios");
const gatewayRequests = require("../../utils/gateway");

module.exports = ({ strapi }) => ({
  async find(ctx) {
    try {
      const extrato = await strapi
        .plugin("pagamento")
        .service("extrato")
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

      if (body === undefined || Object.keys(body).length === 0) {
        throw new Error("Body não está definido");
      }

      const gateway = await strapi
        .plugin("pagamento")
        .service("gateway")
        .findGateway(body.gateway.nome);
      console.log("gateway", gateway);
      const extrato = await strapi
        .plugin("pagamento")
        .service("extrato")
        .findOne(body.extrato.id);
      console.log("extrato", extrato);
      const data = {
        extrato: extrato[0],
        gateway: gateway,
      };
      const url = await gatewayRequests.linkRequest(body.gateway.nome, data);

      let pagamento = await strapi
        .plugin("pagamento")
        .service("pagamento")
        .create(body.extrato.id, body.gateway.id, url);

      ctx.status = 200;
      ctx.body = pagamento;
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
