
module.exports = {
    kind: 'collectionType',
    collectionName: 'gateway',
    info: {
      singularName: 'gateway', // kebab-case mandatory
      pluralName: 'gateways', // kebab-case mandatory
      displayName: 'Gateway de Pagamento',
      description: 'Integração de Pagamento',
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
      nome: {
        type: 'string',
        min: 1,
        max: 50,
        configurable: false,
      },
      client_id: {
        type: 'string',
        min: 1,
        max: 50,
        configurable: false,
      },
      client_secret: {
        type: 'string',
        min: 1,
        max: 50,
        configurable: false,
      },
      ativado: {
        type: "boolean",
        default: false,
        configurable: false,
      },
    }
  };
