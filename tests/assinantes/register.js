const request = require('supertest');

describe('Testes para registros de assinantes', () => {
    const path = "/assinantes";

    beforeAll(async () => {
        lojaResponse = await request(strapi.server.httpServer)
        .post('/lojas')
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: 'lojaRegisterAssinante',
            descricao: 'loja para o teste de registrar assinante',
            endereco: 1,
        })
        loja = lojaResponse.body

        planoResponse = await request(strapi.server.httpServer)
        .post('/planos')
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: 'nome',
            descricao: 'descricao',
            valor: 1.0,
            quantidade_de_cestas: 1,
            quantidade: 1,
            lojas: loja.id
        })
        plano = planoResponse.body
    });

    it("Criação de assinantes", async () => {
        const subscriberBody = {
            nome: user.username,
            cestas_disponiveis: 0,
            planos: plano.id,
            usuario: user.id,
            loja: loja.id
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
});
