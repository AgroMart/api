const request = require('supertest');

const path = "/api/devices/user/";

const mockUserData = {
  username: "user1",
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
    username: 'user2',
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
      expect(data.body.mensagem).toBe("Device encontrado!");
      expect(data.body.device_id).toBe("expoPushToken");
      expect(data.body.status).toBe(200);
    });
});

it("Usuário não encontrado", async () => {
  await request(strapi.server.httpServer)
    .get(path + 'inexistente')
    .set("accept", "application/json")
    .set("Content-Type", "application/json")
    .expect("Content-Type", /json/)
    .expect(400)
    .then((data) => {
      expect(data.body).toBeDefined();
      console.log(data.body);
      expect(data.body.message).toBe("Ops! Aconteceu tivemos um problema em processar sua requisição.");
      expect(data.body.error).toBe("expoPushToken");
    });
});

it("Usuário não enviado", async () => {
  await request(strapi.server.httpServer)
    .get(path)
    .set("accept", "application/json")
    .set("Content-Type", "application/json")
    .expect("Content-Type", /json/)
    .expect(404)
    .then((data) => {
      expect(data.body).toBeDefined();
      expect(data.body.error.name).toBe("NotFoundError");
      expect(data.body.error.message).toBe("Not Found");
    });
});
