
module.exports = {
    kind: 'collectionType',
    collectionName: 'pagamento',
    info: {
      singularName: 'pagamento',
      pluralName: 'pagamentos',
      displayName: 'Pagamento',
      description: 'Lista de pagamentos e faturas',
    },
    options: {
      draftAndPublish: true,
    },
    pluginOptions: {
      'content-manager': {
        visible: false,
      },
      'content-type-builder': {
        visible: false,
      }
    },
    attributes: {
      gateway: {
        type: 'relation',
        relation: 'oneToOne',
        target: 'plugin::pagamento.gateway',
        configurable: false,
      },
      extrato: {
        type: 'relation',
        relation: 'oneToOne',
        target: 'api::extrato.extrato',
        configurable: false,
      },
      url: {
        type: 'string',
        min: 1,
        max: 100,
        configurable: false,
      },
    }
  };
