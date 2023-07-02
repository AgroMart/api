/**
 * Axios with a custom config.
 */
const mercadopago = require('mercadopago');
const paypal = require('paypal-rest-sdk');

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
  return makeConfig('POST', 'https://api-m.sandbox.paypal.com/v1/oauth2/token', config);
}

function createPaymentPayPal(paymentData) {
  return new Promise((resolve, reject) => {
    paypal.payment.create(paymentData, function (error, payment) {
      if (error) {
        reject(`Aconteceu o erro: ${error}`);
      } else {
        const redirectUrl = payment.links.find((link) => link.method === 'REDIRECT').href;
        resolve(redirectUrl);
      }
      reject(`Aconteceu o erro: Não achamos o link do PayPal!`);
    });
  });
}

async function linkPayPal(gateway, itens) {
  paypal.configure({
    mode: 'sandbox', // Modo sandbox para testes (sandbox) ou produção (live)
    client_id: gateway.client_id,
    client_secret: gateway.client_secret,
  });

  const paymentData = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
        return_url: "http://return.url",
        cancel_url: "http://cancel.url"
    },
    transactions: [
      {
        item_list: {
            items: itens.map((objeto) => ({
              name: objeto.produto_avulso.nome ? objeto.produto_avulso.nome : objeto.plano.nome,
              sku: objeto.produto_avulso.nome ? objeto.produto_avulso.nome : objeto.plano.nome,
              currency: "BRL",
              price: objeto.valor.toFixed(2),
              quantity: objeto.quantidade
            })) 
        },
        amount: {
          total: itens.reduce((total, item) => total + (item.quantidade * item.valor), 0).toFixed(2), // Valor do pagamento
          currency: 'BRL', // Moeda (Reais brasileiros)
        },
        description: "Pagamento Agromart"
      },
    ]
  };

  return await createPaymentPayPal(paymentData);
}

function createPaymentDefault(paymentData) {
  return new Promise((resolve, reject) => {
    paypal.payment.create(paymentData, function (error, payment) {
      if (error) {
        reject(`Aconteceu o erro: ${error}`);
      } else {
        const redirectUrl = payment.links.find((link) => link.method === 'REDIRECT').href;
        resolve(redirectUrl);
      }
      reject(`Aconteceu o erro: Não achamos o link do PayPal!`);
    });
  });
}

function convertTextToJson(text, extrato) {
  const items = [];
  for (let i = 0; i < extrato.itens.length; i++) {
    const replacedText = text.replace(/INDEX/g, i.toString());
    const item = eval(`(${replacedText})`);
    items.push(item);
  }
  return { items };
}

function configDefault(pagamento_dados, extrato){
  config['data'] = convertTextToJson(pagamento_dados, extrato.itens)
  return config
}


async function linkDefault(gateway, extrato) {

  const config = makeConfig(gateway.pagamento_method, gateway.pagamento_url, configDefault(gateway.pagamento_dados, extrato));

  return await createPaymentDefault(config);
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
        return linkPayPal(data.gateway, data.extrato.itens);;
      case 'Mercado Pago':
        return linkMercadoPago(data.gateway, data.extrato.itens);
      default:
        return linkDefault(data.gateway, data.extrato);
    }
  }
};

module.exports = gatewayRequests;
