const axios = require("axios");
const fs = require("fs");
require("dotenv/config")

// Ao executar essa função, será salvo um arquivo com as chaves de acesso ao firebase.
async function saveFirebaseKeys() {
  try {
    const response = await axios.get(process.env.SERVICE_ACCOUNT_KEY_URL);
    const keys =  JSON.stringify(response.data);

    if(process.env.NODE_ENV === 'development'){
      console.log(keys);
    }

    fs.writeFile('service_account_keys.json', keys , function (err) {
      if (err) throw err;

      console.log('service_account_keys saved!');
    });
    return 0;

  } catch (error) {
    console.error(error);
  }
}

saveFirebaseKeys()
