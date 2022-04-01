"use strict";

const sendNotifications = require("../services/sendNotificationsExpo");

module.exports = {
  async sendPushNotification(ctx) {
    try {
      const { title, bodyText } = ctx.request.body;

      // const users = await strapi.db
      //   .query("user", "users-permissions")
      //   .find({ loja: store });

      // const usersIds = users.map((user) => {
      //   return user.id;
      // });

      // const devices = await strapi.db
      //   .query("devices")
      //   .find({ user_fk: usersIds });

      const devices = await strapi.db.query("devices").find();

      const pushTokens = devices.map((device) => {
        return device.expo_push_token;
      });

      await sendNotifications.sendNotificationsExpo(
        title,
        bodyText,
        pushTokens
      );

      ctx.status = 200;
      ctx.body = { mensagem: "Notificações enviadas com sucesso!" };
    } catch (error) {
      ctx.body = {
        message:
          "Ops! Aconteceu tivemos um problema em processar sua requisição.",
        error: error.message,
      };
      ctx.status = 400;
    }
  },
};
