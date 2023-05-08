const request = require('supertest');

describe('Testes para registros de extratos e produtos', () => {
    const path = "/extratoes";
    
    beforeAll(async () => {

        lojaResponse = await request(strapi.server.httpServer)
        .post('/lojas')
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: 'lojaRegisterAssinante',
            descricao: 'loja para o teste de registrar assinante',
            endereco: 1,
        })
        loja = lojaResponse.body
    });

    it("Criação de extratoes e produtos", async () => {
        const extractBody = {
            valor: 10,
            user: user.id,
            loja: loja.id,
            itens: {
              produtos: [
                {
                    produto: 'produto 1',
                    quantidade: 1,
                    valor: 4,
                },
                {
                    produto: 'produto 1',
                    quantidade: 2,
                    valor: 3,
                }
              ],
            },
            pagamento_realizado: true,
          };
      
        await request(strapi.server.httpServer)
            .post(path)
            .send(extractBody)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.valor).toBeDefined();
                expect(data.body.itens).toBeDefined();
                expect(data.body.entregue).toBeDefined();
                expect(data.body.tipo_de_entrega).toBeDefined();
                expect(data.body.pagamento_realizado).toBeDefined();
                expect(data.body.id).toBeDefined();
            });
    });
});
