'use strict';

/**
 * plano service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::plano.plano');
