const request = require('supertest');

describe('Testes de cestas', () => {
    const path = "/cestas";
    const mockUserData = {
        username: "userregister",
        email: "userregister@strapi.com",
        password: "1234userregister"
      };
    beforeAll(async () => {
        response = await request(strapi.server.httpServer)
            .post('/auth/local')
            .send({
                identifier: mockUserData.email,
                password: mockUserData.password});
        user = response.body.user
        jwt = response.body.jwt

        await request(strapi.server.httpServer)
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
            descricao: "cesta contendo: 1xTeste de 200g.",
            valor: 1.59,
            quantidade: 2,
            loja: loja.id
        }).set("Authorization",`Bearer  ${jwt}`);
        cesta = response.body
    });

    
    it("Altera quantidade de cestas", async () => {
        await request(strapi.server.httpServer)
            .put(`${path}/${cesta.id}`).send({
                quantidade: cesta.quantidade -1,
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
