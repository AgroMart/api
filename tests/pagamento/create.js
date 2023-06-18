const request = require('supertest');

describe('Testes para gerar link de pagamento', () => {
    const path = "/pagamento/pagamento";

    it("Gera link de pagamento com base no gateway e extrato", async () => {
        await request(strapi.server.httpServer)
            .post(`${path}/link`)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
            });
    });

});