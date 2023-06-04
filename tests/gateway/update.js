const request = require('supertest');

describe('Testes para atualizar gateway de pagamento', () => {
    const path = "/pagamento/gateway";

    it("Atualiza gateway de pagamento", async () => {
        const body = {
            id: 1,
            nome: 'PayPall',
            client_id: 'client_id'}
        await request(strapi.server.httpServer)
            .put(`${path}/1`)
            .set("Authorization",`Bearer  ${jwt}`)
            .send(body)
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.nome).toBe(body.nome);
                expect(data.body.client_id).toBe(body.client_id);
            });
    });

    it("Exceção de id", async () => {
        const body = {
            id: 1,
            nome: 'PayPall',
            client_id: 'client_id'}
        await request(strapi.server.httpServer)
            .put(`${path}/2`)
            .set("Authorization",`Bearer  ${jwt}`)
            .send(body)
            .expect(400)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.error).toBe('Diferentes tipos de id!')
            });
    });
    it("Exceção de body", async () => {
        await request(strapi.server.httpServer)
            .put(`${path}/1`)
            .set("Authorization",`Bearer  ${jwt}`)
            .expect(400)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.error).toBe('Body não está definido')
            });
    });
});
