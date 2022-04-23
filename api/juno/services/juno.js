'use strict';

const axios = require("axios");
require("dotenv").config();
var base64 = require("base-64");

const urlDevelopment = "https://sandbox.boletobancario.com";
const urlProduction = "https://api.juno.com.br";
const baseUrl = process.env.NODE_ENV === "production" ? urlProduction : urlDevelopment;

module.exports = {

getAccessToken: async (clientId, clientSecret) => {
  const hash = base64.encode(`${clientId}:${clientSecret}`);
  const authUrl = baseUrl + "/authorization-server/oauth/token";

  try {
    const response = await axios.post(
      authUrl,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${hash}`,
        },
      }
    );

    if (response.data) {
      console.log("Response token\n\n", response.data);

      return response.data.access_token;
    }

    return;
  } catch (error) {
    console.log(
      "Aconteceu um erro na requisição do access_token!",
      error.message,
    );
  }
},

tokenizeCreditCard: async (creditCardHash, accessToken, privateToken) => {
  const tokenizationUrl = baseUrl + "/api-integration/credit-cards/tokenization";

  try {
    const response = await axios.post(tokenizationUrl,
      {creditCardHash},
      {
      headers: {
        "X-API-Version": 2,
        "X-Resource-Token": privateToken,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Tokenization\n", response.data);
    return response.data
  } catch (error) {
    console.log("Erro ao gerar token do cartão!\n", error.message, error.details);
  }
},

createBilling: async (chargeData, billingData, accessToken, privateToken) => {
    const billingObj = {
    charge: {
      description: chargeData.description,
       references: [
            "Avista"
        ],
      amount: chargeData.amount,
      dueDate: chargeData.dueDate,
      paymentTypes: ["CREDIT_CARD"],
      paymentAdvance: false
    },
      billing: {
      name: billingData.name,
      document: billingData.document,
      email: billingData.email,
      birthDate: billingData.birthDate,
      notify: false
      }
  }

  try {
    const billingUrl = baseUrl + "/api-integration/charges";

    const response = await axios.post(billingUrl,
      billingObj,
      {
      headers: {
        "X-API-Version": 2,
        "X-Resource-Token": privateToken,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Gen billing response\n", response.data._embedded.charges[0]);

    return response.data._embedded.charges[0];
  } catch (error) {
    console.log("Erro ao criar cobrança\n", error);
  }
},

chargeOnCreditCard: async (chargeId, billingData, creditCardId, accessToken, privateToken) => {
  const paymentUrl = baseUrl + "/api-integration/payments";
  const paymentData = {
    chargeId,
    billing: {
    email: billingData.email,
    address: {
            street: billingData.street,
            number: billingData.number,
            complement: billingData.complement,
            neighborhood: billingData.neighborhood,
            city: billingData.city,
            state: billingData.state,
            postCode: billingData.postCode
        },
    delayed: false
  },
  creditCardDetails: {
      creditCardId
  }
}
  try {
    const response = await axios.post(paymentUrl,
      paymentData,
      {
      headers: {
        "X-API-Version": 2,
        "X-Resource-Token": privateToken,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Payment response\n", response);

    return {
      transactionId: response.data.transactionId,
      installments: response.data.installments,
      ...response.data.payments[0]
    };
  } catch (error) {
    console.log("Erro ao precessar pagamento\n", error);
  }
}

};
