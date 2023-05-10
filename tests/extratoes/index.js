const request = require('supertest');

describe('Testes para registros de extratos e produtos', () => {
    const path = "/extratoes";
    
    beforeAll(async () => {

        enderecoResponse = await request(strapi.server.httpServer)
        .post( "/enderecos")
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            cidade: 'cidade2',
            numero: 2,
            complemento: 'complemento2',
            rua: 'rua2',
            cep: 'cep2',
            bairro: "Gama",
            user: user.id,
        })

        endereco = enderecoResponse.body

        lojaResponse = await request(strapi.server.httpServer)
        .post('/lojas')
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
            nome: 'lojaExtrato',
            descricao: 'loja para o teste de registrar extrato',
            endereco: endereco.id,
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

    it("Coleta de extratoes", async () => {      
        await request(strapi.server.httpServer)
            .get(`${path}?user=${user.id}`)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                data.body.forEach(item => {
                    expect(item.loja.nome).toBeDefined();
                    expect(item.valor).toBeDefined();
                    expect(item.pagamento_realizado).toBeDefined();
                    expect(item.created_at).toBeDefined();
                })
            });
    });
});
