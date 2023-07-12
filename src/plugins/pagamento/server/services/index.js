'use strict';

const gateway = require('./gateway');
const extrato = require('./extrato');
const pagamento = require('./pagamento');

module.exports = {
  gateway,
  extrato,
  pagamento,
};
