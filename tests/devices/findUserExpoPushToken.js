const request = require('supertest');

const path = "/devices/user/";

const mockUserData = {
  username: "usuario3",
  email: "testador@strapi.com",
  provider: "local",
  password: "1234abc",
  confirmed: true,
  blocked: null,
  expoPushToken: null
};

it("Não deve encontrar o device", async () => {
  const user = await strapi.plugins["users-permissions"].services.user.add({
    ...mockUserData,
  });

  await request(strapi.server.httpServer)
    .get(path + user.id)
    .set("accept", "application/json")
    .set("Content-Type", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .then((data) => {
      expect(data.body).toBeDefined();
      expect(data.body.mensagem).toBe("Device não encontrado!");
      expect(data.body.status).toBe(404);
    });
});

it("Deve encontrar o device", async () => {
  const user = await strapi.plugins["users-permissions"].services.user.add({
    ...mockUserData,
    username: 'usuario4',
    expoPushToken: 'expoPushToken'
  });

  await request(strapi.server.httpServer)
    .get(path + user.id)
    .set("accept", "application/json")
    .set("Content-Type", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .then((data) => {
      expect(data.body).toBeDefined();
      console.log(data.body);
      expect(data.body.mensagem).toBe("Device encontrado!");
      expect(data.body.device_id).toBe("expoPushToken");
      expect(data.body.status).toBe(200);
    });
});
