const fs = require('fs');
const { setupStrapi, cleanupStrapi, destroyStrapi } = require("./helpers/strapi");
const { getUser, getJWT, setupUser } = require("./helpers/user");

jest.setTimeout(150000);
beforeAll(async () => {
  await setupStrapi();
  await setupUser();
  user = getUser();
  jwt = getJWT();
});

afterAll(async () => {
  await cleanupStrapi();
  await destroyStrapi();
});

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});

// require('./assinantes');
// require('./auth');
// require('./cestas');
// require('./devices');
// require('./enderecos');
require('./extratoes');
// require('./gateway');
// require('./lojas');
// require('./notificacoes');
// require('./pagamento');
// require('./planos');
// require('./produtos-avulsos');
