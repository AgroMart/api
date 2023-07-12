const request = require('supertest');

describe('Testes para achar gateway de pagamento', () => {
    const path = "/pagamento/gateway";

    it("Coleta gateway de pagamento", async () => {
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

    it("Coleta apenas um gateway de pagamento", async () => {
        await request(strapi.server.httpServer)
            .get(`${path}/1`)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
            });
    });

    it("Coleta apenas gateways ativados", async () => {

        const body = {
            nome: 'TesteAtivado',
            ativado: true
        }
        
        await request(strapi.server.httpServer)
            .post(`${path}`)
            .set("Authorization",`Bearer  ${jwt}`)
            .send(body)

        await request(strapi.server.httpServer)
            .get(`${path}/ativado`)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
            });
    });
});
