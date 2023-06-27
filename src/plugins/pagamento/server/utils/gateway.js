/**
 * Axios with a custom config.
 */
const mercadopago = require('mercadopago');
const xml2js = require('xml2js');

function convertObjectToXml(obj) {
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(obj);
  return xml;
}

function pagseguroConfig(email, token) {
  console.log(email)
  return {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1'
    },
    params: {
      email: "giovannabbottino@gmail.com",
      token: token
    }
  };
}

function linkPagSeguroConfig(email, token, itens) {
  let config = pagseguroConfig(email, token);

  const xmlData = {
    checkout: {
      currency: 'BRL',
      itens: {
        item: itens.map((objeto, index) => ({
          id: index + 1,
          description: objeto.produto_avulso.nome ? objeto.produto_avulso.nome : objeto.plano.nome,
          amount: objeto.valor,
          quantity: objeto.quantidade
        }))
      }      
    }
  };
  
  config['data'] = convertObjectToXml(xmlData);
  return makeConfig('POST', 'https://ws.pagseguro.uol.com.br/v2/checkout', config);
}

function makeConfig(method, url, config) {
  return {
    ...config,
    method,
    url
  };
}

function mercadoPagoConfig(token) {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
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
      case 'MercadoPago':
        return false;
      case 'PagSeguro':
        return linkPagSeguroConfig(data.gateway.email, data.gateway.token, data.extrato.itens);
      default:
        return false;
    }
  }
};

module.exports = gatewayRequests;
