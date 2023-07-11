/**
 * Axios with a custom config.
 */
const axios = require("axios");
const mercadopago = require("mercadopago");
const paypal = require("paypal-rest-sdk");

function makeConfig(method, url, config) {
  return {
    ...config,
    method,
    url,
  };
}

async function linkMercadoPago(gateway, itens) {
  mercadopago.configure({
    access_token: gateway.token,
  });
  const preference_data = {
    items: itens.map((objeto) => ({
      title: objeto.produto_avulso.nome
        ? objeto.produto_avulso.nome
        : objeto.plano.nome,
      currency_id: "BRL",
      unit_price: objeto.valor,
      quantity: objeto.quantidade,
    })),
  };

  const response = await mercadopago.preferences
    .create(preference_data)
    .catch(function (error) {
      throw new Error(`Aconteceu o erro: ${error}`);
    });
  return await Promise.resolve(response.body.init_point);
}

function paypalConfig() {
  return {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
}

function authPayPal(client_secret, client_id) {
  let config = paypalConfig();
  config["headers"]["Authorization"] =
    "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  config["data"] = "grant_type=client_credentials";
  return makeConfig("POST", "https://api-m.paypal.com/v1/oauth2/token", config);
}

function createPaymentPayPal(paymentData) {
  return new Promise((resolve, reject) => {
    paypal.payment.create(paymentData, function (error, payment) {
      if (error) {
        reject(`Aconteceu o erro: ${error}`);
      } else {
        const redirectUrl = payment.links.find(
          (link) => link.method === "REDIRECT"
        ).href;
        resolve(redirectUrl);
      }
      reject(`Aconteceu o erro: Não achamos o link do PayPal!`);
    });
  });
}

async function linkPayPal(gateway, itens) {
  paypal.configure({
    mode: "sandbox", // Modo sandbox para testes (sandbox) ou produção (live)
    client_id: gateway.client_id,
    client_secret: gateway.client_secret,
  });

  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://return.url",
      cancel_url: "http://cancel.url",
    },
    transactions: [
      {
        item_list: {
          items: itens.map((objeto) => ({
            name: objeto.produto_avulso.nome
              ? objeto.produto_avulso.nome
              : objeto.plano.nome,
            sku: objeto.produto_avulso.nome
              ? objeto.produto_avulso.nome
              : objeto.plano.nome,
            currency: "BRL",
            price: objeto.valor.toFixed(2),
            quantity: objeto.quantidade,
          })),
        },
        amount: {
          total: itens
            .reduce((total, item) => total + item.quantidade * item.valor, 0)
            .toFixed(2), // Valor do pagamento
          currency: "BRL", // Moeda (Reais brasileiros)
        },
        description: "Pagamento Agromart",
      },
    ],
  };

  return await createPaymentPayPal(paymentData);
}

function createPaymentDefault(paymentData, pagamento_response) {
  return new Promise((resolve, reject) => {
    try {
      console.log(paymentData);
      console.log(typeof paymentData);
      let res = axios(paymentData);
      console.log(res.request.header);
      console.log(pagamento_response);
      resolve(res[pagamento_response]);
    } catch (error) {
      reject(`Aconteceu o erro: ${error}`);
    }
  });
}

function getProperties(input) {
  if (typeof input === "string") {
    if (input.includes("||")) {
      var parts = input.split("||");
      var result = parts.map(function (part) {
        return part.split(".");
      });
      return result;
    } else {
      return input.split(".");
    }
  }
  return input;
}

function isNestedList(list) {
  for (var i = 0; i < list.length; i++) {
    if (Array.isArray(list[i])) {
      return true;
    }
  }
  return false;
}

function getObject(input, target, index) {
  let returnObject = input;
  let replacementTarget = target;
  let replacementField;
  if (typeof returnObject === "string") {
    replacementField = getProperties(returnObject);
    if (!isNestedList(replacementField)) {
      for (let part in replacementField) {
        if (replacementField[part] == "index") {
          replacementTarget = replacementTarget[index];
        } else {
          replacementTarget = replacementTarget[replacementField[part]];
        }
      }
    } else {
      let aux;
      for (let element in replacementField) {
        replacementTarget = target;
        let replacementElement = replacementField[element];
        for (let part in replacementElement) {
          if (replacementElement[part] == "index") {
            if (replacementTarget[replacementElement[part]] !== null) {
              replacementTarget = replacementTarget[index];
            } else if (replacementTarget[replacementElement[part]] === null) {
              replacementTarget = null;
              break;
            }
          } else {
            if (replacementTarget[replacementElement[part]] !== null) {
              replacementTarget = replacementTarget[replacementElement[part]];
            } else if (replacementTarget[replacementElement[part]] === null) {
              replacementTarget = null;
              break;
            }
          }
        }
        if (typeof replacementTarget === "string") {
          aux = replacementTarget;
        }
      }
      replacementTarget = aux;
    }
    return replacementTarget;
  } else {
    for (let field in returnObject) {
      returnObject[field] = getObject(
        returnObject[field],
        { ...target },
        index
      );
    }
    return returnObject;
  }
}

function substituirValores(string, extrato) {
  // Convert the input string to JSON format
  let inputJSON;
  let arr = [];

  try {
    inputJSON = JSON.parse(string);
  } catch (error) {
    console.log("Error no JSON string " + error);
    throw new Error("Error no JSON string " + error);
  }
  var currentDate = new Date();
  var formattedDate = currentDate.toISOString().split("T")[0];

  for (let field in inputJSON) {
    if (field === "items") {
      const aux = { ...inputJSON["items"] };
      for (let index in extrato.itens) {
        let newObject = getObject({ ...aux[0] }, { ...extrato }, index);
        arr.push(newObject);
      }
      inputJSON[field] = arr;
    } else {
      inputJSON[field] = getObject(inputJSON[field], { ...extrato }, null);
    }
  }

  console.log(JSON.stringify(inputJSON));
  return JSON.stringify(inputJSON);
}

function configDefault(gateway, extrato) {
  return {
    body: substituirValores(gateway.pagamento_dados, extrato),
    headers: {
      Authorization: `Basic ${Buffer.from(gateway.token).toString("base64")}`,
    },
    params: substituirValores(gateway.pagamento_params, gateway),
  };
}

async function linkDefault(gateway, extrato) {
  const data = configDefault(gateway, extrato);
  const config = makeConfig(
    gateway.pagamento_method,
    gateway.pagamento_url,
    data
  );
  return await createPaymentDefault(config, gateway.pagamento_response);
}

const gatewayRequests = {
  authRequest: (gateway, data) => {
    switch (gateway) {
      case "PayPal":
        return authPayPal(data.client_secret, data.client_id);
      case "MercadoPago":
        mercadopago.configure({
          access_token: data.token,
        });
        return false;
      default:
        return false;
    }
  },
  linkRequest: (gateway, data) => {
    switch (gateway) {
      case "PayPal":
        return linkPayPal(data.gateway, data.extrato.itens);
      case "Mercado Pago":
        return linkMercadoPago(data.gateway, data.extrato.itens);
      default:
        return linkDefault(data.gateway, data.extrato);
    }
  },
};

module.exports = gatewayRequests;
