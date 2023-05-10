const request = require('supertest');

describe('Testes coletar notificacoes', () => {
    const path = "/notificacoes";
    

    it("Coleta notificacoes", async () => {
        await request(strapi.server.httpServer)
            .get(path)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                console.log(data.body)
            //     expect(data.body).toBeDefined();
            //     data.body.forEach(item => {
            //         expect(item.index).toBeDefined();
            //         expect(item.title).toBeDefined();
            //         expect(item.body_text).toBeDefined();
            // });
        });
    });
});
