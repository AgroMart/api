const path = require('path');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres');

  const parse = require('pg-connection-string').parse;
  const config = parse(env('DATABASE_URL') || '');

  const connections = {
    postgres: {
      connection: {
        host: config.host,
        port: config.port,
        database: config.database ? `${config.database}-test` : 'test-db',
        user: config.user,
        password: config.password,
        ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    }
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
