'use strict';

/**
 * devices service
 */

module.exports = () => ({
    update: async (body) => {
        try {
            const user = await strapi.db.query('plugin::users-permissions.user').update({
                where: { id: body.user_id },
                data: {
                    expoPushToken: body.expo_push_token,
                },
              });
            return user;
        } catch (error) {
            return error;
        }
    },
    findUserExpoPushToken: async (user_id) => {
        try {
            const expoPushToken = await strapi.db.query('plugin::users-permissions.user').findOne({
                select: ['expoPushToken'],
                where: { id: user_id }
                })
        
            return expoPushToken;
        } catch (error) {
            return error;
        }
    },
});
