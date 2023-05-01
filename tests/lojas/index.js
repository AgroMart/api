const request = require('supertest');

describe('Testes coletar Lojas', () => {
    const path = "/lojas";
    const mockUserData = {
        username: "userlojas",
        email: "userlojas@strapi.com",
        provider: "local",
        password: "1234userlojas",
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

        await request(strapi.server.httpServer)
        .post('/lojas')
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: 'lojaLoja',
            descricao: 'loja para o teste de coletar lojas',
            endereco: 1,
        })
    });

    it("Coleta lojas", async () => {
        await request(strapi.server.httpServer)
            .get(path)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                console.log(data.body)
                expect(data.body).toBeDefined();
                data.body.forEach(item => {
                    expect(item.id).toBeDefined();
                    expect(item.nome).toBeDefined();
                    expect(item.endereco.bairro).toBeDefined();
            });
        });
    });
});
