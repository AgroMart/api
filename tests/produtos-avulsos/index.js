const request = require('supertest');

describe('Testes de produtos', () => {
    const path = "/produtos-avulsos";
    
    beforeAll(async () => {
        response = await request(strapi.server.httpServer)
        .post('/lojas')
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: 'lojaLoja',
            descricao: 'loja para o teste de produtos',
            endereco: 1,
        });

        loja = response.body

        response = await request(strapi.server.httpServer)
        .post(path).send({
            nome:"Carne de teste",
            unidade_medida: "Kg" ,
            descricao: "Teste",
            valor: 1.59,
            quantidade: 2,
            loja: loja.id
        }).set("Authorization",`Bearer  ${jwt}`);
        produto = response.body
    });

    
    it("Altera item avulso", async () => {
        await request(strapi.server.httpServer)
            .put(`${path}/${produto.id}`).send({
                quantidade: produto.quantidade -1,
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
