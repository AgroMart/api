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
      pagamento_url: "https://api.mercadopago.com/v1/payments",
      pagamento_method: "post",
      pagamento_dados:
        '{"additional_info": {\
              "items": [\
                {\
                  "description": "itens.index.produto_avulso.nome||itens.index.plano.nome",\
                  "quantity": "itens.index.quantidade",\
                  "unit_price": "itens.index.valor"\
                }\
              ],\
              "payer": {}\
            },\
            "description": "fixed.payment",\
            "installments": "fixed.1",\
            "payer": { "email": "user.email" },\
            "payment_method_id": "fixed.pix",\
            "transaction_amount": "fixed.3"\
          }',
      pagamento_response: "point_of_interaction.transaction_data.ticket_url",
      pagamento_params: "",
    };

    const gatewayResponse = await request(strapi.server.httpServer)
      .post(`/pagamento/gateway`)
      .set("Authorization", `Bearer  ${jwt}`)
      .send(bodyCreateGateway);

    const gateway = gatewayResponse.body;

    const bodyMocked = {
      additional_info: {
        items: [
          {
            description: "produto 1",
            quantity: 1,
            unit_price: 4,
          },
          {
            description: "produto 1",
            quantity: 2,
            unit_price: 3,
          },
        ],
        payer: {},
      },
      description: "payment",
      installments: 1,
      payer: { email: "userteste@strapi.com" },
      payment_method_id: "pix",
      transaction_amount: 3,
    };

    const response = {
      point_of_interaction: {
        type: "PIX",
        application_data: {
          name: "NAME_SDK",
          version: "VERSION_NUMBER",
        },
        transaction_data: {
          qr_code_base64:
            "iVBORw0KGgoAAAANSUhEUgAABRQAAAUUCAYAAACu5p7oAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAIABJREFUeJzs2luO3LiWQNFmI+Y/Zd6vRt36KGNXi7ZOBtcagHD4kNLeiLX33v8DAAAAABD879sDAAAAAAA/h6AIAAAAAGSCIgAAAACQCYoAAAAAQCYoAgAAAACZoAgAAAAAZIIiAAAAAJAJigAAAABAJigCAAAAAJmgCAAAAABkgiIAAAAAkAmKAAAAAEAmKAIAAAAAmaAIAAAAAGSCIgAAAACQCYoAAAAAQCYoAgAAAACZoAgAAAAAZIIiAAAAAJAJigAAAABAJigCA...",
          qr_code:
            "00020126600014br.gov.bcb.pix0117test@testuser.com0217dados adicionais520400005303986540510.005802BR5913Maria Silva6008Brasilia62070503***6304E2CA",
          ticket_url:
            "https://www.mercadopago.com.br/payments/123456789/ticket?caller_id=123456&hash=123e4567-e89b-12d3-a456-426655440000",
        },
      },
    };

    nock("https://api.mercadopago.com", {
      reqheaders: {
        Authorization: `Basic ${Buffer.from(bodyCreateGateway.token).toString(
          "base64"
        )}`,
        "Content-Type": "application/json",
      },
    })
      .post("/v1/payments", bodyMocked)
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
      //.expect(200)
      .then((data) => {
        console.log(data.body);
        expect(data.body).toBeDefined();
        expect(data.body.url).toBeDefined();
        expect(data.body.url).toBe(response.secure_url);
      });
  });
  it("Gera link de pagamento com base no gateway Iugu e extrato", async () => {
    const bodyCreateGateway = {
      nome: "Iugu",
      token: "token",
      pagamento_url: "https://api.iugu.com/v1/invoices",
      pagamento_method: "post",
      pagamento_dados:
        '{"email":"user.email", \
                  "items":[ \
                      {"description": "itens.index.produto_avulso.nome||itens.index.plano.nome", \
                      "price_cents": "itens.index.valor", \
                      "quantity": "itens.index.quantidade"}]}',
      pagamento_response: "secure_url",
      pagamento_params: '{"api_token": "token"}',
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
        Authorization: `Basic ${Buffer.from(bodyCreateGateway.token).toString(
          "base64"
        )}`,
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
