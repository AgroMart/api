const request = require('supertest');
const nock = require('nock');

describe('Testes para gerar link de pagamento', () => {
    const path = "/pagamento/pagamento";

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

        extratoResponse = await request(strapi.server.httpServer)
        .post( "/extratoes")
        .set("Authorization",`Bearer  ${jwt}`)
        .send({
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
            pagamento_realizado: false,
          });

        extrato = extratoResponse.body;
    });

    it("Gera link de pagamento com base no gateway PagSeguro e extrato", async () => {
        const mockBody = {
            extrato: extrato,
            gateway: {
                id: 3,
                nome: 'PagSeguro',
                email: 'emaildeteste@gmail.com',
                token: '95112EE828D94278BD394E91C4388F20',
                ativado: true
            }
        };

        const xmlResponse = `
            <?xml version="1.0" encoding="ISO-8859-1"?>
            <checkout>
                <code>8CF4BE7DCECEF0F004A6DFA0A8243412</code>
                <date>2010-12-02T10:11:28.000-02:00</date>
            </checkout>
            `;

        nock('https://ws.pagseguro.uol.com.br')
        .post('/v2/checkout')
        .query({ email: 'emaildeteste@gmail.com', token: '95112EE828D94278BD394E91C4388F20'})
        .reply(200, xmlResponse, { 'Content-Type': 'application/xml' })


        await request(strapi.server.httpServer)
            .post(`${path}/link`)
            .send(mockBody)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.url).toBeDefined();
        });
    });

    it("Coleta link de pagamento com base no gateway e extrato", async () => {
        const mockBody = {
            extrato: extrato,
            gateway: {
                id: 2,
                nome: 'MercadoPago',
                client_id: 'client_id',
                client_secret: 'client_secret',
                token: 'token',
                ativado: true
            }
        };
        const data = {
            url: 'url',
            extrato: extrato.id,
            gateway: mockBody.gateway.id
        }
        await strapi.db.query('plugin::pagamento.pagamento').create({
            data: data,
        });

        await request(strapi.server.httpServer)
            .post(`${path}/link`)
            .send(mockBody)
            .set("accept", "application/json")
            .set("Authorization",`Bearer  ${jwt}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.url).toBeDefined();
        });
    });
});
