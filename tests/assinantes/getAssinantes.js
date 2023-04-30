const request = require('supertest');

describe('Teste para recuperação de informações de assinantes', () => {
    const path = "/assinantes";
    const mockUserData = {
        username: "usergetassinantes",
        email: "usergetassinantes@strapi.com",
        provider: "local",
        password: "1234usergetassinantes",
        confirmed: true,
        blocked: null,
        expoPushToken: null
      };
   
    beforeAll(async () => {
        registerResponse = await request(strapi.server.httpServer)
        .post('/auth/local/register')
        .send({
            username: mockUserData.username,
            password: mockUserData.password,
            email: mockUserData.email,
        })

        user = registerResponse.body.user
        jwt = registerResponse.body.jwt

        planoResponse = await request(strapi.server.httpServer)
        .post('/planos')
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: 'nome',
            descricao: 'descricao',
            valor: 1.0,
            quantidade_de_cestas: 1,
            quantidade: 1,
        })
        plano = planoResponse.body

        subcriberResponse = await request(strapi.server.httpServer)
        .post("/assinantes")
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: "Subcription Name",
            cestas_disponiveis: 0,
            planos: plano.id,
            usuario: user.id,
            loja: 1
        });
        subscriber = subcriberResponse.body;
    });

    
    it("Get assinantes por id", async () => {
        await request(strapi.server.httpServer)
            .get(`${path}?usuario=${user.id}`)
            .set("Authorization",`Bearer  ${jwt}`)
            .set("accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                console.log(data.body)
                data.body.forEach(item => {
                    console.log(item.planos);
                    expect(item.id).toBeDefined();
                    expect(item.pular_cesta).toBeDefined();
                    expect(item.cestas_disponiveis).toBeDefined();
                    })
            });
    });
    // it("Get todos assinantes", async () => {
    //     await request(strapi.server.httpServer)
    //         .get(`${path}`)
    //         .set("Authorization",`Bearer  ${jwt}`)
    //         .set("accept", "application/json")
    //         .set("Content-Type", "application/json")
    //         .expect(200)
    //         .then((data) => {
    //             expect(data.body).toBeDefined();
    //             data.body.forEach(item => {
    //                 expect(item.id).toBeDefined();
    //                 expect(item.pular_cesta).toBeDefined();
    //                 expect(item.created_at).toBeDefined();
    //                 expect(item.cestas_disponiveis).toBeDefined();
    //                 })
    //                 console.log(data.body)
    //         });
    // });
    // it("Edita um assinante por id", async () => {
    //     const subscriberBody = {
    //         nome: user.username,
    //         cestas_disponiveis: 2,
    //         planos: plano.id,
    //         usuario: user.id,
    //         loja: 1
    //     };
    //     await request(strapi.server.httpServer)
    //         .put(`${path}/${subscriber.id}`)
    //         .send(subscriberBody)
    //         .set("accept", "application/json")
    //         .set("Authorization",`Bearer  ${jwt}`)
    //         .set("Content-Type", "application/json")
    //         .expect(200)
    //         .then((data) => {
    //             expect(data.body).toBeDefined();
    //             expect(data.body.id).toBeDefined();
    //         });
    // });
});
