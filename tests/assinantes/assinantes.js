const request = require('supertest');
/*
api.put(`assinantes/${id}`, {
        pular_cesta: !switchValue,
      });
*/
describe('Teste para lidar com assinantes', () => {
    const path = "/assinantes";
    const mockUserData = {
        username: "userassinantes",
        email: "userassinantes@strapi.com",
        provider: "local",
        password: "1234userassinantes",
        confirmed: true,
        blocked: null,
        expoPushToken: null
      };
    beforeAll(async () => {
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

    it("Criação de assinantes", async () => {
        const subscriberBody = {
            nome: user.username,
            cestas_disponiveis: 0,
            plano: 1,
            usuario: user.id,
            loja: 1
        };
        await request(strapi.server.httpServer)
            .post(path)
            .send(subscriberBody)
            .set("accept", "application/json")
            .set("Authorization","Bearer "+jwt)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.data.id).toBeDefined();
                expect(data.body.data.attributes).toBeDefined();
            });
    });
    it("Get assinantes por id", async () => {
        await request(strapi.server.httpServer)
            .get(path+'?usuario=${'+user.id+'}')
            .set("Authorization","Bearer "+jwt)
            .set("accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                console.log(data.body)
                expect(data.body.data).toBeDefined();
            });
    })
    /*
    it("Get todos assinante", async () => {
        await request(strapi.server.httpServer)
            .get(path+'/')
            .set("accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
            expect(data.body).toBeDefined();
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
    */
});
  