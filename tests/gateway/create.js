const request = require('supertest');

describe('Testes para criar gateway de pagamento', () => {
    const path = "/pagamento/gateway";

    it("Cria gateway de pagamento Stripe", async () => {
        const body = {
            nome: 'Stripe',
            token: 'token',
            pagamento_url: 'https://api.stripe.com/v1/payment_links',
            pagamento_method: 'post'
        }

        await request(strapi.server.httpServer)
            .post(`${path}`)
            .set("Authorization",`Bearer  ${jwt}`)
            .send(body)
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.nome).toBe(body.nome);
                expect(data.body.token).toBe(body.token);
            });
    });

    it("Cria gateway de pagamento Iugu", async () => {
        const body = {
            nome: 'Iugu',
            token: 'token',
            pagamento_url: 'https://api.iugu.com/v1/invoices',
            pagamento_method: 'post',
            pagamento_dados: "{ email: extrato.user.email, \
                items: [ \
                { \
                    'description': extrato.itens[INDEX]['valor'], \
                    'price_cents': extrato.itens[INDEX]['valor'], \
                    'quantity': extrato.itens[INDEX]['quantidade'], \
                }, \
              ]}",
            pagamento_response:  "secure_url"
        }

        await request(strapi.server.httpServer)
            .post(`${path}`)
            .set("Authorization",`Bearer  ${jwt}`)
            .send(body)
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.nome).toBe(body.nome);
                expect(data.body.token).toBe(body.token);
            });
    });

});
