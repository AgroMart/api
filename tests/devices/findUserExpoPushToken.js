const request = require('supertest');

describe('Tester para achar o User Expo Push Token', () => {
  const path = "/devices/user/";
  const mockUserData = {
    username: "userExpo",
    email: "userExpo@strapi.com",
    provider: "local",
    password: "1234userExpo",
    confirmed: true,
    blocked: null,
    expoPushToken: null
  };

  beforeAll(async () => {
    /** Creates a new user an push to database */
    response = await request(strapi.server.httpServer)
      .post('/auth/local/register')
      .send({
        username: mockUserData.username,
        password: mockUserData.password,
        email: mockUserData.email,
    })
    user = response.body.user
    jwt = response.body.jwt
  });

  it("Não deve encontrar o device", async () => {
    await request(strapi.server.httpServer)
      .get(path + user.id)
      .set("accept", "application/json")
      .set("Authorization","Bearer "+jwt)
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
      .set("Authorization","Bearer "+jwt)
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
      .get(path + 0)
      .set("accept", "application/json")
      .set("Authorization","Bearer "+jwt)
      .set("Content-Type", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .then((data) => {
        expect(data.body).toBeDefined();
        expect(data.body.message).toBe("Ops! Aconteceu tivemos um problema em processar sua requisição.");
        expect(data.body.error).toBe("Cannot read properties of null (reading 'expoPushToken')");
      });
  });
  
  it("Usuário não enviado", async () => {
    await request(strapi.server.httpServer)
      .get(path)
      .set("accept", "application/json")
      .set("Authorization","Bearer "+jwt)
      .set("Content-Type", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .then((data) => {
        expect(data.body).toBeDefined();
        expect(data.body.error.name).toBe("NotFoundError");
        expect(data.body.error.message).toBe("Not Found");
      });
  });
  
});
