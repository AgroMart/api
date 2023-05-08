const fs = require('fs');
const { setupStrapi, cleanupStrapi } = require("./helpers/strapi");
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
});

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});

require('./assinantes');
require('./auth');
require('./cestas');
require('./devices');
require('./enderecos');
require('./extratoes');
require('./lojas');
require('./planos');
require('./produtos-avulsos');
