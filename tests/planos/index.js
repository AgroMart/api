const request = require('supertest');

describe('Testes de planos', () => {
    const path = "/cestas";
    
    beforeAll(async () => {

        await request(strapi.server.httpServer)
        .post('/lojas')
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: 'lojaLoja',
            descricao: 'loja para o teste de produtos',
            endereco: 1,
        });

        loja = response.body
        subscriberBody = {
            nome: user.username,
            cestas_disponiveis: 0,
            planos: plano.id,
            usuario: user.id,
            loja: loja.id
        };

        response = await request(strapi.server.httpServer)
            .post( "/assinantes") 
            .send({
                nome: user.username,
                cestas_disponiveis: 0,
                usuario: user.id,
                loja: loja.id
            });
        assinantes = response.body

        response = await request(strapi.server.httpServer)
        .post(path).send({
            nome: "Teste de planos",
            descricao: "planos",
            valor: 1.59,
            quantidade: 2,
            quantidade_de_cestas: 1,
            loja: loja.id,
            assinantes: [assinantes.id]
        }).set("Authorization",`Bearer  ${jwt}`);
        plano = response.body
    });

    
    it("Altera quantidade de planos", async () => {
        await request(strapi.server.httpServer)
            .put(`${path}/${plano.id}`).send({
                quantidade: plano.quantidade -1,
            })
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.quantidade).toBe(1);
            });
    });
});
