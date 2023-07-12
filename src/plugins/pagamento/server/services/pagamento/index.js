'use strict';

module.exports = ({ strapi }) => ({
    find: async (extrato_id, gateway_id) => {
        const pagamento = await strapi.db.query('plugin::pagamento.pagamento').findOne({
            where: {  $and: [
                {
                    extrato: extrato_id
                },
                {
                    gateway: gateway_id
                }
                ],
            }
        });
        return pagamento;
    },
    create: async (extrato_id, gateway_id, url) => {
        try {
            const data = {
                url: url,
                extrato: extrato_id,
                gateway: gateway_id
            }
            const pagamento = await strapi.db.query('plugin::pagamento.pagamento').create({
                data: data,
            });
            return pagamento;
        } catch (error) {
            return error;
        }
    },
});
