const request = require('supertest');
const nock = require('nock');

describe('Testes para atualizar gateway de pagamento', () => {
    const path = "/pagamento/gateway";

    it("Atualiza gateway de pagamento PayPall", async () => {
        const body = {
            id: 1,
            nome: 'PayPall',
            client_id: 'client_id',
            client_secret: 'client_secret'
        }
        
        const scope = nock('https://api-m.paypal.com')
            .post('/v1/oauth2/token')
            .reply(200, {
                "scope": "https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/disputes/read-buyer https://uri.paypal.com/services/payments/realtimepayment https://uri.paypal.com/services/disputes/update-seller https://uri.paypal.com/services/payments/payment/authcapture openid https://uri.paypal.com/services/disputes/read-seller https://uri.paypal.com/services/payments/refund https://api-m.paypal.com/v1/vault/credit-card https://api-m.paypal.com/v1/payments/.* https://uri.paypal.com/payments/payouts https://api-m.paypal.com/v1/vault/credit-card/.* https://uri.paypal.com/services/subscriptions https://uri.paypal.com/services/applications/webhooks",
                "access_token": "A21AAFEpH4PsADK7qSS7pSRsgzfENtu-Q1ysgEDVDESseMHBYXVJYE8ovjj68elIDy8nF26AwPhfXTIeWAZHSLIsQkSYz9ifg",
                "token_type": "Bearer",
                "app_id": "APP-80W284485P519543T",
                "expires_in": 31668,
                "nonce": "2020-04-03T15:35:36ZaYZlGvEkV4yVSz8g6bAKFoGSEzuy3CQcz3ljhibkOHg"
              });
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

    it("Atualiza gateway de pagamento MercadoPago", async () => {
        const body = {
            id: 2,
            nome: 'MercadoPago',
            client_id: 'client_id',
            client_secret: 'client_secret'
        }
        
        const scope = nock('https://api.mercadopago.com')
            .post('/oauth/toke')
            .reply(200, {
                "access_token": "APP_USR-4934588586838432-XXXXXXXX-241983636",
                "token_type": "bearer",
                "expires_in": 15552000,
                "scope": "offline_access read write",
                "user_id": 241983636,
                "refresh_token": "TG-XXXXXXXX-241983636",
                "public_key": "APP_USR-d0a26210-XXXXXXXX-479f0400869e",
                "live_mode": true
              });
        await request(strapi.server.httpServer)
            .put(`${path}/1`)
            .set("Authorization",`Bearer  ${jwt}`)
            .send(body)
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.nome).toBe(body.nome);
                expect(data.body.client_id).toBe(body.client_id);
                expect(data.body.client_secret).toBe(body.client_secret);
            });
    });

    it("Atualiza gateway de pagamento PagSeguro", async () => {
        const body = {
            id: 3,
            nome: 'PagSeguro',
            email: 'emaildeteste@gmail.com',
            token: '95112EE828D94278BD394E91C4388F20'
        }
        
        await request(strapi.server.httpServer)
            .put(`${path}/1`)
            .set("Authorization",`Bearer  ${jwt}`)
            .send(body)
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.nome).toBe(body.nome);
                expect(data.body.email).toBe(body.email);
                expect(data.body.token).toBe(body.token);
            });
    });

    it("Exceção de id", async () => {
        const body = {
            id: 1,
            nome: 'PayPall',
            client_id: 'client_id'}

        const scope = nock('https://api-m.paypal.com/v1/oauth2/token')
            .post('/oauth/toke')
            .reply(200, {
                "scope": "https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/disputes/read-buyer https://uri.paypal.com/services/payments/realtimepayment https://uri.paypal.com/services/disputes/update-seller https://uri.paypal.com/services/payments/payment/authcapture openid https://uri.paypal.com/services/disputes/read-seller https://uri.paypal.com/services/payments/refund https://api-m.paypal.com/v1/vault/credit-card https://api-m.paypal.com/v1/payments/.* https://uri.paypal.com/payments/payouts https://api-m.paypal.com/v1/vault/credit-card/.* https://uri.paypal.com/services/subscriptions https://uri.paypal.com/services/applications/webhooks",
                "access_token": "A21AAFEpH4PsADK7qSS7pSRsgzfENtu-Q1ysgEDVDESseMHBYXVJYE8ovjj68elIDy8nF26AwPhfXTIeWAZHSLIsQkSYz9ifg",
                "token_type": "Bearer",
                "app_id": "APP-80W284485P519543T",
                "expires_in": 31668,
                "nonce": "2020-04-03T15:35:36ZaYZlGvEkV4yVSz8g6bAKFoGSEzuy3CQcz3ljhibkOHg"
              });
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

    after(() => {
        nock.cleanAll();
    });
});
