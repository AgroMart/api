const Strapi = require("@strapi/strapi");
const { exec } = require('child_process');
const fs = require("fs");

let instance;

async function setupStrapi() {
  if (!instance) {
    await Strapi().load();
    instance = strapi;
    
    await instance.server.mount();
  }
  return instance;
}

async function cleanupStrapi() {
  const dbSettings = strapi.config.get("database.connection");

  //close server to release the db-file
  await strapi.server.httpServer.close();

  // close the connection to the database before deletion
  await strapi.db.connection.destroy();
  // Build the command to drop the test database
  const command = `dropdb
  --if-exists 
  --host=${dbSettings.connection.host} 
  --port=${dbSettings.connection.port} 
  --username=${dbSettings.connection.user} 
  --password=${dbSettings.connection.password} 
  ${dbSettings.connection.database}`;
 
   // Execute the command to drop the test database
   exec(command, (error, stdout, stderr) => {
     if (error) {
       console.error(`Error dropping test database: ${error.message}`);
       return;
     }
     if (stderr) {
       console.error(`Stderr from dropping test database: ${stderr}`);
       return;
     }
     console.log(`Test database dropped: ${stdout}`);
   });
}

module.exports = { setupStrapi, cleanupStrapi };
