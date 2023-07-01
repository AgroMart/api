/**
 * Axios with a custom config.
 */
const mercadopago = require('mercadopago');

function makeConfig(method, url, config) {
  return {
    ...config,
    method,
    url
  };
}

async function linkMercadoPago(gateway, itens) {
  mercadopago.configure({
    access_token: gateway.token
  });
  const preference_data = {
    items: itens.map((objeto) => ({
        title: objeto.produto_avulso.nome ? objeto.produto_avulso.nome : objeto.plano.nome,
        currency_id: "BRL",
        unit_price: objeto.valor,
        quantity: objeto.quantidade
      })) 
  };
  
  const response = await mercadopago.preferences.create(preference_data)
  .catch(function(error){
    throw new Error(`Aconteceu o erro: ${error}`);
  });
  return await Promise.resolve(response.body.init_point);
}

function paypalConfig() {
  return {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
}

function authPayPal(client_secret, client_id) {
  let config = paypalConfig();
  config['headers']['Authorization'] = 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  config['data'] = 'grant_type=client_credentials';
  return makeConfig('POST', 'https://api-m.paypal.com/v1/oauth2/token', config);
}


const gatewayRequests = {
  authRequest: (gateway, data) => {
    switch (gateway) {
      case 'PayPal':
        return authPayPal(data.client_secret, data.client_id);
      case 'MercadoPago':
        mercadopago.configure({
          access_token: data.token
        });
        return false;
      default:
        return false;
    }
  },
  linkRequest: (gateway, data) => {
    switch (gateway) {
      case 'PayPal':
        return authPayPal(data.client_secret, data.client_id);
      case 'Mercado Pago':
        return linkMercadoPago(data.gateway, data.extrato.itens);
      default:
        return false;
    }
  }
};

module.exports = gatewayRequests;
