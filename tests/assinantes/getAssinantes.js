const request = require('supertest');

describe('Teste para recuperação de informações de assinantes', () => {
    const path = "/assinantes";

    beforeAll(async () => {
        lojaResponse = await request(strapi.server.httpServer)
        .post('/lojas')
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: 'lojaGetAssinante',
            descricao: 'loja para o teste de get assinante',
            endereco: 1,
        })
        loja = lojaResponse.body

        planoResponse = await request(strapi.server.httpServer)
        .post('/planos')
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: 'teste nome',
            descricao: 'descricao',
            valor: 1.0,
            quantidade_de_cestas: 1,
            quantidade: 1,
            lojas: loja.id
        })
        plano = planoResponse.body

        subcriberResponse = await request(strapi.server.httpServer)
        .post("/assinantes")
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: "Subcription Name",
            cestas_disponiveis: 0,
            planos: plano.id,
            usuario: user.id,
            loja: loja.id
        });
        subscriber = subcriberResponse.body;subcriberResponse = await request(strapi.server.httpServer)
        .post("/assinantes")
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: "Other Subcription Name",
            cestas_disponiveis: 0,
            planos: plano.id,
            usuario: user.id,
            loja: loja.id
        });
        subscriber = subcriberResponse.body;
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
                    expect(item.cestas_disponiveis).toBeDefined();
                    item.planos.forEach(plano => {
                        expect(plano.quantidade_de_cestas).toBeDefined();
                        expect(plano.valor).toBeDefined();
                        expect(plano.nome).toBeDefined();
                        expect(plano.nome).toBe("teste nome");
                        expect(plano.descricao).toBeDefined();
                        })
                    })
            });
    });
    it("Get todos assinantes", async () => {
        await request(strapi.server.httpServer)
            .get(`${path}`)
            .set("Authorization",`Bearer  ${jwt}`)
            .set("accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.length).toBe(2);
                data.body.forEach(item => {
                    expect(item.id).toBeDefined();
                    expect(item.pular_cesta).toBeDefined();
                    expect(item.cestas_disponiveis).toBeDefined();
                    item.planos.forEach(plano => {
                        expect(plano.quantidade_de_cestas).toBeDefined();
                        expect(plano.valor).toBeDefined();
                        expect(plano.nome).toBeDefined();
                        expect(plano.descricao).toBeDefined();
                        })
                    })
            });
    });
    it("Edita um assinante por id", async () => {
        const subscriberBody = {
            nome: user.username,
            cestas_disponiveis: 2,
            planos: plano.id,
            usuario: user.id
        };
        await request(strapi.server.httpServer)
            .put(`${path}/${subscriber.id}`)
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
