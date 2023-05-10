'use strict';

/**
 * devices service
 */

"use strict";
const { sanitizeEntity } = require("strapi-utils");

module.exports = () => ({
    find: async () => {
        try {
            const notifications = await strapi.services.notification.find();
            console.log(notifications);
            return notifications.map((notification) =>
              sanitizeEntity(notification, strapi.models.notification)
            );
        } catch (error) {
            return error;
        }
    }
});
