const request = require('supertest');

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

        response = await request(strapi.server.httpServer)
        .post('/planos')
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: 'nome',
            descricao: 'descricao',
            valor: 1.0,
            quantidade_de_cestas: 1,
            quantidade: 1,
        })
        plano = response.body
    });

    it("Criação de assinantes", async () => {
        const subscriberBody = {
            nome: user.username,
            cestas_disponiveis: 0,
            plano: plano.id,
            usuario: user.id,
            loja: 1
        };
        await request(strapi.server.httpServer)
            .post(path)
            .send(subscriberBody)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.id).toBeDefined();
            });
    });
    it("Get assinantes por id", async () => {
        await request(strapi.server.httpServer)
            .get(`${path}?usuario=${user.id}`)
            .set("Authorization",`Bearer  ${jwt}`)
            .set("accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                data.body.forEach(item => {
                    expect(item.id).toBeDefined();
                    expect(item.pular_cesta).toBeDefined();
                    expect(item.created_at).toBeDefined();
                    expect(item.cestas_disponiveis).toBeDefined();
                    })
            });
    });
    it("Edita um assinante por id", async () => {
        const subscriberBody = {
            nome: user.username,
            cestas_disponiveis: 2,
            plano: plano.id,
            usuario: user.id,
            loja: 1
        };
        await request(strapi.server.httpServer)
            .put(`${path}/${user.id}`)
            .send(subscriberBody)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.id).toBeDefined();
            });
    });
});
