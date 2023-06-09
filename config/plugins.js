module.exports = ({ env }) => ({
    "expo-notifications": {
      enabled: true,
    },
    'pagamento': {
      enabled: true,
      resolve: './src/plugins/pagamento'
    },
  });
