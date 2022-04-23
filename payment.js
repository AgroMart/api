const axios = require("axios");
require("dotenv").config();
var base64 = require("base-64");

// module.exports = {};

const urlDevelopment = "https://sandbox.boletobancario.com/";
const urlProduction = "https://api.juno.com.br/";
const baseUrl =
  process.env.NODE_ENV === "production" ? urlProduction : urlDevelopment;

const cardData = {
  holderName: "Byron K B Correa",
  cardNumber: "5162929492536134",
  securityCode: "528 ",
  expirationMonth: "04",
  expirationYear: "2030",
};

const clientSecret = "@7wX@y;,$Y|V0IToLyV{Lu#+^=ItEt:E";
const clientId = "V193lbm4v3WG2XSX";
const privateToken =
  "9455D60BF3329FFB9675693692EDE6FB591B2444481BF17276657C27ECFCCFEF";
const publicToken =
  "F457DFE393E04EEC86A8A9C4CA0204D060BF3295B6B4E28FDCEBED807385E850";

const getAccessToken = async () => {
  const hash = base64.encode(`${clientId}:${clientSecret}`);
  const authUrl = baseUrl + "authorization-server/oauth/token";

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
      console.log("Response\n\n", response.data);

      return response.data.access_token;
      // response.data
      // {
      //   access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJieXJvbmthbWFsQGhvdG1haWwuY29tIiwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTY1MDAzNDMwNiwianRpIjoiWmQ3TE5QYkdoZjJwRldEZnZmeldwQkx6WWZjIiwiY2xpZW50X2lkIjoiVjE5M2xibTR2M1dHMlhTWCJ9.oAyKXfHSY3mqRX2lw1vxZW5jZZ3O4FhMUxo4UCMt9SvInx9fQs82X8MudM4a5xHx5XqCee8iPusAqH_jWvZL58iHHqVJY-I2pSEJ0FzzbD525LjKfnTgh_NSWHw3Vj0C3Ny0czCHv40wefGzv5mT_kwsP73y8QR2g7exoBCeHnL9VdriOgDL1_4oG0L3xAcEecXRMyD91SyhRcCf4OrhlmkqpZpOeSyFMjdgKjVcGoe1mRcIn41U1ie2PqS0JzgqZttX4AdN03g_HIj0razUU1QdQbLN7Hh0wCSsJI8B_etsTSehuGJEKMsGyiABARPx9ghNHsR0J9ZDNn9zANhlOg',
      //   token_type: 'bearer',
      //   expires_in: 86399,
      //   scope: 'all',
      //   user_name: 'byronkamal@hotmail.com',
      //   jti: 'Zd7LNPbGhf2pFWDfvfzWpBLzYfc'
      // }
    }

    return;
  } catch (error) {
    console.log(
      "Aconteceu um erro na requisição do access_token!",
      error.message,
    );
  }
};

const tokenizeCreditCard = async () => {
  const tokenizationUrl = baseUrl + "api-integration/credit-cards/tokenization";
  const creditCardHash = "533330c9-28f6-4367-97ae-87ba8e0a5952";

  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(tokenizationUrl, {
      headers: {
        "X-API-Version": "2",
        "X-Resource-Token": privateToken,
        "Content-Type": " application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Tokenization\n", response);
  } catch (error) {
    console.log("Erro ao gerar token do cartão!\n", error);
  }
};

const createBilling = async () => {
  const billingData = {
    charge: {
      description: "CREDIT CARD SAMPLE",
       references: [
            "Avista"
        ],
      amount: 100,
      dueDate: "2022-04-20",
      paymentTypes: ["CREDIT_CARD"],
      paymentAdvance: false
    },
      billing: {
      name: "Joao do teste",
      document: "41830934066",
      email: "joao@bol.com.br",
      birthDate: "1982-08-05",
      notify: false
      }
  }

  try {
    const accessToken = await getAccessToken();
    const billingUrl = baseUrl + "/payments";

    const response = await axios.post(billingUrl,
      billingData,
      {
      headers: {
        "X-Resource-Token": privateToken,
        "Content-Type": " application/json",
        "X-API-Version": "2",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Gen billing response\n", response);
  } catch (error) {
    console.log("Erro ao cria cobrança\n", error);
  }

  // {
  //   "_embedded": {
  //     "charges": [
  //       {
  //         "id": "chr_5ABE16C0986B2427A43DA54B232BDEA0",
  //         "code": 137403649,
  //         "reference": "Avista",
  //         "dueDate": "2022-04-20",
  //         "checkoutUrl": "https://pay-sandbox.juno.com.br/checkout/01AC63C3E60DB82068B3B60A73BC1E3493F119F4862BA2B9",
  //         "amount": 80.00,
  //         "status": "ACTIVE",
  //         "_links": {
  //           "self": {
  //             "href": "https://sandbox.boletobancario.com/api-integration/charges/chr_5ABE16C0986B2427A43DA54B232BDEA0"
  //           }
  //         }
  //       }
  //     ]
  //   }
  // }
};

const chargeOnCreditCard = () => {
  const accessToken = await getAccessToken();
  const chargeUrl = baseUrl + "/payments";

  const paymentData = {
    chargeId: "chr_12C1EEA740E2A623364E28955E76E103",
    billing: {
    email: "joao@bol.com.br",
    address: {
            street: "Rua Teste",
            number: 0,
            complement: "",
            neighborhood: "Bairro Teste",
            city: "Curitiba",
            state: "PR",
            postCode: "80030070"
        },
    delayed: false
    },
    creditCardDetails: {
        creditCardId: "aba59f8c-fa3a-4347-b724-1b6a4c5a1939"
    }
}

  try {
    const response = await axios.post(billingUrl,
      paymentData,
      {
      headers: {
        "X-API-Version": "2",
        "X-Resource-Token": privateToken,
        "Content-Type": " application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Gen billing response\n", response);
  } catch (error) {
    console.log("Erro ao cria cobrança\n", error);
  }
}


(async () => {
  // await getAccessToken();
  await tokenizeCreditCard();
})();
