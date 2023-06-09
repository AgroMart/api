const request = require('supertest');

describe('Testes coletar Lojas', () => {
    const path = "/lojas";

    it("Coleta lojas", async () => {
        await request(strapi.server.httpServer)
            .get(path)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                data.body.forEach(item => {
                    expect(item.id).toBeDefined();
                    expect(item.nome).toBeDefined();
                    expect(item.endereco.bairro).toBeDefined();
            });
        });
    });
});
