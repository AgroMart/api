/**
 * Axios with a custom config.
 */
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

function pagseguroConfig(email, token) {
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

function authPayPal(client_secret, client_id) {
  let config = paypalConfig();
  config['headers']['Authorization'] = 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  config['data'] = 'grant_type=client_credentials';
  return makeConfig('POST', 'https://api-m.paypal.com/v1/oauth2/token', config);
}

const gatewayRequests = {
  authRequest: (gateway, body) => {
    switch (gateway) {
      case 'PayPal':
        return authPayPal(body.client_secret, body.client_id);
      default:
        return false;
    }
  }
};

module.exports = gatewayRequests;
