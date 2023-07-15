const request = require("supertest");
const nock = require("nock");

describe("Testes para gerar link de pagamento", () => {
  const path = "/pagamento/pagamento";

  beforeAll(async () => {
    enderecoResponse = await request(strapi.server.httpServer)
      .post("/enderecos")
      .set("Authorization", `Bearer  ${jwt}`)
      .send({
        cidade: "cidade2",
        numero: 2,
        complemento: "complemento2",
        rua: "rua2",
        cep: "cep2",
        bairro: "Gama",
        user: user.id,
      });

    endereco = enderecoResponse.body;

    lojaResponse = await request(strapi.server.httpServer)
      .post("/lojas")
      .set("Authorization", `Bearer  ${jwt}`)
      .send({
        nome: "lojaExtrato",
        descricao: "loja para o teste de registrar extrato",
        endereco: endereco.id,
      });
    loja = lojaResponse.body;

    extratoResponse = await request(strapi.server.httpServer)
      .post("/extratoes")
      .set("Authorization", `Bearer  ${jwt}`)
      .send({
        valor: 10,
        user: user.id,
        loja: loja.id,
        itens: {
          produtos: [
            {
              produto: "produto 1",
              quantidade: 1,
              valor: 4,
            },
            {
              produto: "produto 1",
              quantidade: 2,
              valor: 3,
            },
          ],
        },
        pagamento_realizado: false,
      });

    extrato = extratoResponse.body;
  });
  it("Gera link de pagamento com base no gateway Mercado Pago e extrato", async () => {
    const bodyCreateGateway = {
      nome: "Mercado pago generico",
      token: "token",
      pagamento_url: "https://api.mercadopago.com/checkout/preferences",
      pagamento_method: "post",
      pagamento_dados:
        '{\
          "items" : [\
              {\
                "id": "${extrato.itens.index.id}",\
                "title": "${extrato.itens.index.produto_avulso.nome||extrato.itens.index.plano.nome}",\
                "quantity": "${extrato.itens.index.quantidade}",\
                "unit_price": "${extrato.itens.index.valor}"\
              }\
            ]\
          }',
      pagamento_response: "init_point",
      pagamento_params: "",
    };

    const gatewayResponse = await request(strapi.server.httpServer)
      .post(`/pagamento/gateway`)
      .set("Authorization", `Bearer  ${jwt}`)
      .send(bodyCreateGateway);

    const gateway = gatewayResponse.body;

    const bodyMocked = {
      
        items: [
          {
            id:1,
            title: "produto 1",
            quantity: 1,
            unit_price: 4,
          },
          {
            id:2,
            title: "produto 1",
            quantity: 2,
            unit_price: 3,
          }]
    };

    const response = {
      "init_point": "https://www.mercadopago.com/mla/checkout/start?pref_id=202809963-920c288b-4ebb-40be-966f-700250fa5370"
    };

    nock("https://api.mercadopago.com", {
      reqheaders: {
        Authorization: `Bearer ${gateway.token}`,
        "Content-Type": "application/json",
      },
    })
      .post("/checkout/preferences", bodyMocked)
      .reply(200, response);

    const mockBody = {
      gateway: { nome: gateway.nome },
      extrato: extrato,
    };

    await request(strapi.server.httpServer)
      .post(`${path}/link`)
      .send(mockBody)
      .set("accept", "application/json")
      .set("Authorization", `Bearer  ${jwt}`)
      .set("Content-Type", "application/json")
      .expect(200)
      .then((data) => {
        expect(data.body).toBeDefined();
        expect(data.body.url).toBeDefined();
        expect(data.body.url).toBe(response.init_point);
      });
  });
  it("Gera link de pagamento com base no gateway Iugu e extrato", async () => {
    const bodyCreateGateway = {
      nome: "Iugu",
      token: "token",
      pagamento_url: "https://api.iugu.com/v1/invoices",
      pagamento_method: "post",
      pagamento_dados:
        '{"email":"${extrato.user.email}", \
          "items": [\
            {"description": "${extrato.itens.index.produto_avulso.nome||extrato.itens.index.plano.nome}", \
            "price_cents": "${extrato.itens.index.valor}", \
            "quantity": "${extrato.itens.index.quantidade}"}]}',
      pagamento_response: "secure_url",
      pagamento_params: '{"api_token": "${gateway.token}"}',
    };

    const gatewayResponse = await request(strapi.server.httpServer)
      .post(`/pagamento/gateway`)
      .set("Authorization", `Bearer  ${jwt}`)
      .send(bodyCreateGateway);

    const gateway = gatewayResponse.body;

    const bodyMocked = {
      email: "userteste@strapi.com",
      items: [
        {
          description: "produto 1",
          quantity: 1,
          price_cents: 4,
        },
        {
          description: "produto 1",
          quantity: 2,
          price_cents: 3,
        },
      ],
    };

    const response = {
      secure_url: "https://exemplo.com/link_de_pagamento",
    };

    nock("https://api.iugu.com", {
      reqheaders: {
        Authorization: `Bearer ${gateway.token}`,
        "Content-Type": "application/json",
      },
    })
      .post("/v1/invoices", bodyMocked)
      .query({ api_token: bodyCreateGateway.token })
      .reply(200, response);

    const mockBody = {
      gateway: { nome: gateway.nome },
      extrato: extrato,
    };

    await request(strapi.server.httpServer)
      .post(`${path}/link`)
      .send(mockBody)
      .set("accept", "application/json")
      .set("Authorization", `Bearer  ${jwt}`)
      .set("Content-Type", "application/json")
      .expect(200)
      .then((data) => {
        expect(data.body).toBeDefined();
        expect(data.body.url).toBeDefined();
        expect(data.body.url).toBe(response.secure_url);
      });
  });
});
