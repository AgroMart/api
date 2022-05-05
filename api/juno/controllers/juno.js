"use strict";

const junoServices = require("../services/juno");

module.exports = {
  async creditCardPayment(ctx) {
    try {
      const { storeId, userId, creditCard, chargeData, billingData } =
        ctx.request.body;

      const store = await strapi.db.query("loja").findOne({ id: storeId })

      const apiKeys = await strapi.db.query("juno").findOne({ user: store.usuario.id });

      const clientSecret = apiKeys.client_secret;
      const clientId = apiKeys.client_id;
      const privateToken = apiKeys.private_token;

      const accessToken = await junoServices.getAccessToken(
        clientId,
        clientSecret
      );

      const tokenizedCard = await junoServices.tokenizeCreditCard(
        creditCard.hash,
        accessToken,
        privateToken
      );

      const insertedCreditCard = await strapi.query("juno-credit-card").create({
        cardholder_name: creditCard.cardholderName,
        credit_card_id: tokenizedCard.creditCardId,
        last_4_numbers: Number(tokenizedCard.last4CardNumber),
        expiration_month: Number(tokenizedCard.expirationMonth),
        expiration_year: Number(tokenizedCard.expirationYear),
        user: userId,
      });

      const charge = await junoServices.createBilling(
        chargeData,
        billingData,
        accessToken,
        privateToken
      );

      const insertBilling = await strapi.query("billing").create({
        charge_id: charge.id,
        charge_description: chargeData.description,
        amount: charge.amount,
        name: billingData.name,
        document: billingData.document,
        email: billingData.email,
        birth_date: billingData.birthDate,
        street: billingData.street,
        number: billingData.number,
        complement: billingData.complement,
        neighborhood: billingData.neighborhood,
        city: billingData.city,
        state: billingData.state,
        postCode: billingData.postCode,
        checkout_url: charge.checkoutUrl,
        user: userId,
        loja: storeId,
      });

      const payment = await junoServices.chargeOnCreditCard(
        charge.id,
        billingData,
        tokenizedCard.creditCardId,
        accessToken,
        privateToken
      );

      console.log("PAGAMENTO\n\n", payment);
      await strapi.query("payment").create({
        transaction_id: payment.transactionId,
        installments: payment.installments,
        payment_id: payment.id,
        release_date: payment.releaseDate,
        amount: payment.amount,
        fee: payment.fee,
        status: payment.status,
        fail_reason: payment.failReason,
        juno_credit_card: insertedCreditCard.id,
        billing: insertBilling.id,
        user: userId,
      });

      ctx.status = 200;
      ctx.body = {
        mensagem: "Pagamento realizado com sucesso!",
        status: 200,
      };
    } catch (error) {
      console.log("Pagamento não realizado\n", error);

      ctx.body = {
        message:
          "Ops! Aconteceu tivemos um problema ao precessar seu pagamento.",
        error: error.message,
      };
      ctx.status = 400;
    }
  },
};
