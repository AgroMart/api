'use strict';

/**
 * devices service
 */

"use strict";
module.exports = () => ({
    find: async () => {
        try {
            const notifications = await strapi.entityService.findMany("plugin::expo-notifications.exponotification");

            return notifications.map((notification) =>
              ({
                index: notification.id,
                title: notification.id,
                body_text: notification.subtitle
              })
            );
        } catch (error) {
            return error;
        }
    }
});
