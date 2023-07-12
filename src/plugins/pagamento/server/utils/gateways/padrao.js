const config = require('../helpers/config');
const axios = require("axios");

async function createPaymentDefault(paymentData, pagamento_response) {
  try {
    const res = await axios(paymentData);
    return res.data[pagamento_response];
  } catch (error) {
    throw new Error(`Aconteceu o erro: ${error}`);
  }
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

  return inputJSON;
}

function configDefault(gateway, extrato) {
  return {
    // data: JSON.stringify(substituirValores(gateway.pagamento_dados, extrato)),
    data: substituirValores(gateway.pagamento_dados, extrato),
    headers: {
      Authorization: `Basic ${Buffer.from(gateway.token).toString("base64")}`,
      'Content-Type': 'application/json',
    },
    params: substituirValores(gateway.pagamento_params, gateway),
  };
}

async function linkRequest(gateway, extrato) {
  const data = configDefault(gateway, extrato);
  const conf = config.makeConfig(
    gateway.pagamento_method,
    gateway.pagamento_url,
    data
  );
  return await createPaymentDefault(conf, gateway.pagamento_response);
}

module.exports = {
    linkRequest
};
