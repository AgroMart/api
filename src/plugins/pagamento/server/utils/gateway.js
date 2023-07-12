/**
 * Axios with a custom config.
 */
const mercadopago = require('./gateways/mercadoPago');
const paypal = require('./gateways/paypal');
const padrao = require('./gateways/padrao');

const gatewayRequests = {
  authRequest: (gateway, data) => {
    switch (gateway) {
      case 'PayPal':
        return paypal.authRequest(data.client_secret, data.client_id);
      default:
        return false;
    }
  },
  linkRequest: (gateway, data) => {
    switch (gateway) {
      case 'PayPal':
        return paypal.linkRequest(data.gateway, data.extrato.itens);
      case 'Mercado Pago':
        return mercadopago.linkRequest(data.gateway, data.extrato.itens);
      default:
        return padrao.linkRequest(data.gateway, data.extrato);
    }
  }
};

module.exports = gatewayRequests;
