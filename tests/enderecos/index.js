const request = require('supertest');

describe('Teste para lidar com enderecos', () => {
    const path = "/enderecos";
    const mockUserData = {
        username: "userenderecos",
        email: "userenderecos@strapi.com",
        provider: "local",
        password: "1234userenderecos",
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

    it("Criação de endereco", async () => {
        const mockBody = {
            cidade: 'cidade',
            numero: 1,
            complemento: 'complemento',
            rua: 'rua',
            cep: 'cep',
            bairro: "Gama",
            user: user.id,
        };
        await request(strapi.server.httpServer)
            .post(path)
            .send(mockBody)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.cidade).toBeDefined();
                expect(data.body.numero).toBeDefined();
                expect(data.body.complemento).toBeDefined();
                expect(data.body.cep).toBeDefined();
                expect(data.body.rua).toBeDefined();
                expect(data.body.bairro).toBeDefined();
            });
    });

    it("Criação de endereco", async () => {
        const mockBody = {
            cidade: 'cidade2',
            numero: 1,
            complemento: 'complemento',
            rua: 'rua',
            cep: 'cep',
            bairro: "Gama",
            user: user.id,
        };
        await request(strapi.server.httpServer)
            .put(`${path}/1`)
            .send(mockBody)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.cidade).toBeDefined();
                expect(data.body.numero).toBeDefined();
                expect(data.body.complemento).toBeDefined();
                expect(data.body.cep).toBeDefined();
                expect(data.body.rua).toBeDefined();
                expect(data.body.bairro).toBeDefined();
            });
    });
});
