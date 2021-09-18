require('dotenv/config')

module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: process.env.DATABASE_HOST,//env('DATABASE_HOST', '127.0.0.1'),
        port: process.env.DATABASE_PORT,//env.int('DATABASE_PORT', 5432),
        database: process.env.DATABASE_NAME,//env('DATABASE_NAME', 'agromart-api'),
        username: process.env.DATABASE_USERNAME,//env('DATABASE_USERNAME', 'postgres'),
        password: process.env.DATABASE_PASSWORD,//env('DATABASE_PASSWORD', 'docker'),
        ssl: false//process.env.DATABASE_SSL ? true : false,//env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});
