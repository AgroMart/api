const request = require('supertest');

describe('Testes coletar notificacoes', () => {
    const path = "/notificacoes";

    beforeAll(async () => {
        data = {
            title: "Título da notificação",
            subtitle: "Corpo da notificação",
            data: { foo: "bar" },
            receivers: ["ExponentPushToken[xxxxxx]", "ExponentPushToken[yyyyyy]"]
        }
        await strapi.entityService.create(
            "plugin::expo-notifications.exponotification",
            { data: data }
          );
    });

    it("Coleta notificacoes", async () => {
        await request(strapi.server.httpServer)
            .get(path)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                data.body.forEach(item => {
                    expect(item.index).toBeDefined();
                    expect(item.title).toBeDefined();
                    expect(item.body_text).toBeDefined();
            });
        });
    });
});
