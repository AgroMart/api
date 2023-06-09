/**
 * axios with a custom config.
 */

function makeConfig(method, url, config) {
  return {
    ...config,
    method,
    url
  };
}

function mercadoPagoConfig() {
  return {
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

function paypalConfig() {
  return {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };
}

function pagseguroConfig(email, token){
  return {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1'
    },
    data: new URLSearchParams({
      'email': email,
      'token': token
    })
  };
}

function authMercadoPago(client_secret, client_id){
  let config = mercadoPagoConfig()
  config['data'] = {
    "client_secret": client_secret,
    "client_id": client_id,
    "grant_type": "authorization_code"
  };
  return makeConfig('post', 'https://api.mercadopago.com/oauth/token', config);
}

function authPayPall(client_secret, client_id){
  let config = paypalConfig()
  config['headers']['Authorization'] = 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64')
  config['data'] = 'grant_type=client_credentials';
  return makeConfig('post', 'https://api-m.paypal.com/v1/oauth2/token', config);
}


function authRequest(gateway, body){
  switch (gateway) {
    case 'PayPall':
      return authPayPall(body.client_secret, body.client_id)
    case 'MercadoPago':
      return authMercadoPago(body.client_secret, body.client_id)
    default:
      return false
  }
}

export default {authRequest};
