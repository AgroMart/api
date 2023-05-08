const request = require('supertest');

describe('Teste para lidar com usuário', () => {
    const path = "/users";
    const mockUserData = {
      username: "userEdited",
      email: "userEdited@strapi.com",
      password: "1234userEdited"
    };
  
    beforeAll(async () => {
      response = await request(strapi.server.httpServer)
            .post("/auth/local/register")
            .send({
                username: mockUserData.username,
                password: mockUserData.password,
                email: mockUserData.email,})
            .set("accept", "application/json")
            .set("Content-Type", "application/json");
      user = response.body.user;
      jwt = response.body.jwt;
    });
  
    it("Edita usuario", async () => {
        await request(strapi.server.httpServer)
          .put(`${path}/${user.id}`)
          .send({email: "userEdited2@strapi.com",
                username: "userEdited2"})
          .set("accept", "application/json")
          .set("Authorization",`Bearer ${jwt}`)
          .set("Content-Type", "application/json")
          .expect(200)
          .then((data) => {
            expect(data.body).toBeDefined();
            expect(data.body.id).toBeDefined();
            expect(data.body.email).toBe("useredited2@strapi.com");
            expect(data.body.username).toBe("userEdited2");
          });
    })
});
  