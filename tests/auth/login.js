const request = require('supertest');

describe('Teste para lidar com login de usuário', () => {
    const path = "/auth/local";
    const mockUserData = {
      username: "userauth",
      email: "userauth@strapi.com",
      provider: "local",
      password: "1234userauth",
      confirmed: true,
      blocked: null,
      expoPushToken: null
    };
  
    beforeAll(async () => {
      /** Creates a new user an push to database */
      user = await strapi.plugins['users-permissions'].services.user.add({
        ...mockUserData
      });
  
      jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
      });
    });
  
    it("Login", async () => {
        await request(strapi.server.httpServer)
          .post(path)
          .send({
              identifier: mockUserData.email,
              password: mockUserData.password})
          .set("accept", "application/json")
          .set("Content-Type", "application/json")
          .expect(200)
          .then((data) => {
            expect(data.body).toBeDefined();
            expect(data.body.jwt).toBeDefined();
            expect(data.body.user).toBeDefined();
          });
    })

    it("Login com senha errada", async () => {
      await request(strapi.server.httpServer)
        .post(path)
        .send({
          identifier: mockUserData.email,
          password: 'senhaerrada'})
        .set("accept", "application/json")
        .set("Content-Type", "application/json")
        .expect(400)
        .then((data) => {
          expect(data.body).toBeDefined();
          expect(data.body.error.name).toBe('ValidationError');
          expect(data.body.error.message).toBe('Invalid identifier or password');
        });
    })

    it("Identifier inexistente", async () => {
      await request(strapi.server.httpServer)
        .post(path)
        .send({
          identifier: 'inexistente',
          password: 'senhaerrada'})
        .set("accept", "application/json")
        .set("Content-Type", "application/json")
        .expect(400)
        .then((data) => {
          expect(data.body).toBeDefined();
          expect(data.body.error.name).toBe('ValidationError');
          expect(data.body.error.message).toBe('Invalid identifier or password');
        });
    })
});
  