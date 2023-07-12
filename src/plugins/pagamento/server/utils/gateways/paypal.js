const paypal = require('paypal-rest-sdk');
const config = require('./../helpers/config');

function paypalConfig() {
    return {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
}

function authRequest(client_secret, client_id) {
    let conf = paypalConfig();
    conf['headers']['Authorization'] = 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    conf['data'] = 'grant_type=client_credentials';
    return config.makeConfig('POST', 'https://api-m.paypal.com/v1/oauth2/token', conf);
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
  
async function linkRequest(gateway, itens) {
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

module.exports = {
    linkRequest,
    authRequest
};
