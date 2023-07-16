const mercadopago = require("mercadopago");

async function linkRequest(gateway, itens) {
  mercadopago.configure({
    access_token: gateway.token,
  });
  console.log("PAssou aqui");
  const preference_data = {
    items: itens.map((objeto) => ({
      title: objeto.produto_avulso.nome
        ? objeto.produto_avulso.nome
        : objeto.plano.nome,
      currency_id: "BRL",
      unit_price: objeto.valor,
      quantity: objeto.quantidade,
    })),
  };

  const response = await mercadopago.preferences
    .create(preference_data)
    .catch(function (error) {
      throw new Error(`Aconteceu o erro: ${error}`);
    });
  return await Promise.resolve(response.body.init_point);
}

module.exports = {
  linkRequest,
};
