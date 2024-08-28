'use strict';

const gateway = require('./gateway/schema');
const pagamento = require('./pagamento/schema');

module.exports = {
  'gateway': { schema: gateway }, // should re-use the singularName of the content-type
  'pagamento': { schema: pagamento },
};
