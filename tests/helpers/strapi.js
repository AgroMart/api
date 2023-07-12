const Strapi = require("@strapi/strapi");
const { Pool } = require('pg');

let instance;

async function setupStrapi() {
  if (!instance) {
    await Strapi().load();
    instance = strapi;
    
    await instance.server.mount();
  }
  return instance;
}

const cleanupStrapi = async () => {
  const tableNamesQuery = strapi.db.connection.raw(`
  SELECT tablename 
  FROM pg_tables 
  WHERE schemaname = 'public'
  `);

  const resp = await tableNamesQuery.then();

  const tableNames = await resp.rows.map(row => row.tablename);

  // Itera sobre cada tabela e exclui seus registros
  for (const tableName of tableNames) {
    const clearTableQuery = strapi.db.connection.raw(`
      TRUNCATE ${tableName} RESTART IDENTITY CASCADE;
    `);

    await clearTableQuery;
  }
};

async function destroyStrapi() {
  await strapi.server.httpServer.close();
  strapi.db.connection.destroy();

  // Disconnect from the Strapi app
  await strapi.destroy();
}


module.exports = { setupStrapi, cleanupStrapi, destroyStrapi };
