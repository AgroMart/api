const { Expo } = require("expo-server-sdk");
require('dotenv').config()

let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN})

module.exports = {
  sendNotificationsExpo: async (title, body, pushTokens) => {

    let messages = [];

    for (let pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
      messages.push({
        to: pushToken,
        sound: "default",
        title,
        body,
      });
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

        tickets.push(...ticketChunk);

        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  },
};
