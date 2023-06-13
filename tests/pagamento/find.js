const request = require('supertest');

describe('Testes para achar tabela pagamento', () => {
    const path = "/pagamento/pagamento";

    it("Coleta extratos para tabela de pagamento", async () => {
        await request(strapi.server.httpServer)
            .get(path)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
            });
    });

});
