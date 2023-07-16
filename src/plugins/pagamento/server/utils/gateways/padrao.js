const config = require("../helpers/config");
const axios = require("axios");

function getValueFromObjectByPath(path, obj) {
  const paths = path.split("||");
  let value = obj;
  let find = false;
  for (const p of paths) {
    const keys = p.split(".");
    let value = obj;

    if (find == false) {
      for (const key of keys) {
        // Verifica se a chave contém um índice
        if (/\d+/.test(key)) {
          const index = parseInt(key, 10);
          value = Array.isArray(value) ? value[index] : undefined;
        } else {
          value = value[key];
        }

        if (value === undefined) {
          break;
        }
      }
    }

    if (value === undefined) {
      find = false;
    } else {
      return value;
    }
  }
}

async function createPaymentDefault(paymentData, pagamento_response) {
  try {
    console.log(paymentData);
    const res = await axios({
      method: paymentData.method,
      url: paymentData.url,
      headers: paymentData.headers,
      data: paymentData.body,
      params: paymentData.params,
    });
    console.log(res.data);
    return getValueFromObjectByPath(pagamento_response, res.data);
  } catch (error) {
    throw new Error(`Aconteceu o erro: ${error}`);
  }
}

function extractValue(string) {
  const regex = /\${(.*?)}/;
  const match = string.match(regex);

  if (match) {
    return match[1];
  }

  return null;
}

function parseJSONRecursively(jsonString) {
  const jsonObject = JSON.parse(jsonString);

  const parseNestedJSON = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        try {
          obj[key] = parseJSONRecursively(obj[key]);
        } catch (error) {
          // Ignorar a string que não é um JSON válido
        }
      } else if (typeof obj[key] === "object") {
        parseNestedJSON(obj[key]);
      }
    }
  };

  parseNestedJSON(jsonObject);
  return jsonObject;
}

function run(string, dado) {
  if (string === "") {
    return {};
  } else {
    let inputJSON;

    // verifica se é um json valido
    inputJSON = parseJSONRecursively(string);

    return substituirValores(inputJSON, dado);
  }
}

function getTotal(extrato) {
  if (extrato.hasOwnProperty("itens")) {
    return extrato.itens.reduce(
      (total, item) => total + item.quantidade * item.valor,
      0
    );
  }
  return 0;
}

function substituirValores(inputJSON, dado) {
  let outputJSON = {};
  // entra em um loop para cada chave do json
  for (const key in inputJSON) {
    if (inputJSON.hasOwnProperty(key)) {
      const value = inputJSON[key];
      if (typeof value === "string") {
        if (extractValue(value)) {
          // valor dentro de um extract value
          if (value === "${valorTotal}") {
            outputJSON[key] = getTotal(dado.extrato);
          } else {
            outputJSON[key] = getValueFromObjectByPath(
              extractValue(value),
              dado
            );
          }
        } else {
          // valor fixo
          outputJSON[key] = value;
        }
      } else if (
        (typeof value === "number" && Number.isFinite(value)) ||
        typeof value === "boolean"
      ) {
        outputJSON[key] = value;
      } else if (Array.isArray(value)) {
        outputJSON[key] = [];
        // se for um array vai ser um array de items
        dado.extrato.itens.forEach((item, index) => {
          let newItem = {};
          for (const kv in value[0]) {
            const valueWithIndex = value[0][kv].replace(/index/g, index);
            newItem[kv] = getValueFromObjectByPath(
              extractValue(valueWithIndex),
              dado
            );
            if (newItem[kv] == null) {
              newItem[kv] = index;
            }
          }
          outputJSON[key].push(newItem);
        });
      } else {
        // se não for nem string nem array vai chamar de novo
        outputJSON[key] = substituirValores(value, dado);
      }
    }
  }
  return outputJSON;
}

function configDefault(gateway, extrato) {
  const data = {
    gateway: gateway,
    extrato: extrato,
  };
  return {
    // data: JSON.stringify(substituirValores(gateway.pagamento_dados, extrato)),
    body: run(gateway.pagamento_dados, data),
    headers: {
      Authorization: `Bearer ${gateway.token}`,
      "Content-Type": "application/json",
    },
    params: run(gateway.pagamento_params, data),
  };
}

async function linkRequest(gateway, extrato) {
  console.log("Chegou no link request");
  const data = configDefault(gateway, extrato);
  const conf = config.makeConfig(
    gateway.pagamento_method,
    gateway.pagamento_url,
    data
  );

  return await createPaymentDefault(conf, gateway.pagamento_response);
}

module.exports = {
  linkRequest,
};
