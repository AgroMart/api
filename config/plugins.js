module.exports = ({ env }) => ({
    "expo-notifications": {
      enabled: true,
    },
    'pagamento': {
      enabled: true,
      resolve: './src/plugins/pagamento'
    },
    'users-permissions': {
      config: {
        jwtSecret: env('JWT_SECRET', 'default-jwt-secret-change-me'),
      },
    },
  });
