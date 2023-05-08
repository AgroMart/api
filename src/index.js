'use strict';

async function setAuthenticatedPermissions(newPermissions, publicRole) {
  const allPermissionsToCreate = [];
  Object.keys(newPermissions).map((controller) => {
    const actions = newPermissions[controller];
    const permissionsToCreate = actions.map((action) => {
      return strapi.query("plugin::users-permissions.permission").create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });
  await Promise.all(allPermissionsToCreate);
}
async function boostrapPermissions(){
  const authenticatedRole = await strapi
  .query("plugin::users-permissions.role")
  .findOne({
    where: {
      type: "authenticated",
    },
  });
  await setAuthenticatedPermissions({
    'assinante' : ['create','delete','find','findOne','update'],
    'cesta' : ['create','delete','find','findOne','update'],
    'devices': [ 'findUserExpoPushToken','update' ],
    'endereco' : ['create','delete','find','findOne','update'],
    'extrato' : ['create','delete','find','findOne','update'],
    'loja' : ['create','delete','find','findOne','update'],
    'plano' : ['create','delete','find','findOne','update'],
    'produto-avulso' : ['create','delete','find','findOne','update'],
  }, authenticatedRole );
  // se necessario pegar a const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({}, []);
  
  await strapi.query("plugin::users-permissions.permission").create({
    data: {
      action: `plugin::users-permissions.user.update`,
      role: authenticatedRole.id,
    },
  });
};
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register( strapi ) {
    
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */


  bootstrap(strapi) {
    boostrapPermissions();
  },
};
