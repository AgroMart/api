const request = require('supertest');

describe('Teste para alterar o User Expo Push Token', () => {
  const path = "/devices/";
  
  it("Deve adicionar o User Expo Push Token", async () => {
    const body = {
        platform: 'Platform.OS',
        model: 'Device.modelName',
        platform_version: 'Device.osVersion',
        expo_push_token: 'pushToken',
        user_id: user.id,
      };
    await request(strapi.server.httpServer)
      .post(path)
      .send({body})
      .set("accept", "application/json")
      .set("Authorization",`Bearer  ${jwt}`)
      .set("Content-Type", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    const expoPushToken = await strapi.db.query('plugin::users-permissions.user').findOne({
        select: ['expoPushToken'],
        where: { id: user.id }
        })

    expect(body.expo_push_token).toBe(expoPushToken.expoPushToken);
  });
  
  it("Teste não enviando o body", async () => {
    await request(strapi.server.httpServer)
      .post(path)
      .set("accept", "application/json")
      .set("Authorization",`Bearer  ${jwt}`)
      .set("Content-Type", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .then((data) => {
        expect(data.body.error.message).toBe('Devices error');
      });
  });

  it("Teste não enviando o user id", async () => {
    const body = {
        expo_push_token: 'pushToken'
      };
    await request(strapi.server.httpServer)
      .post(path)
      .send({body})
      .set("accept", "application/json")
      .set("Authorization",`Bearer  ${jwt}`)
      .set("Content-Type", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .then((data) => {
        expect(data.body.error.message).toBe('Devices error');
      });
  });
  
  it("Teste não enviando o expo_push_token", async () => {
    const body = {
        user_id: user.id
      };
    
    await request(strapi.server.httpServer)
      .post(path)
      .send({body})
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization",`Bearer  ${jwt}`)
      .expect("Content-Type", /json/)
      .expect(400)
      .then((data) => {
        expect(data.body.error.message).toBe('Devices error');
      });
  });
  
  it("Deve atualizar o User Expo Push Token", async () => {
    const body = {
        platform: 'Platform.OS',
        model: 'Device.modelName',
        platform_version: 'Device.osVersion',
        expo_push_token: 'pushToken2',
        user_id: user.id,
      };
    await request(strapi.server.httpServer)
      .put(path + 'pushToken')
      .send({body})
      .set("accept", "application/json")
      .set("Authorization",`Bearer  ${jwt}`)
      .set("Content-Type", "application/json")
      .expect(200);

    const expoPushToken = await strapi.db.query('plugin::users-permissions.user').findOne({
        select: ['expoPushToken'],
        where: { id: user.id }
        })

    expect(body.expo_push_token).toBe(expoPushToken.expoPushToken);
  });

  it("Não deve atualizar o User Expo Push Token com caminho errado", async () => {
    const body = {
        platform: 'Platform.OS',
        model: 'Device.modelName',
        platform_version: 'Device.osVersion',
        expo_push_token: 'pushToken3',
        user_id: user.id,
      };
    await request(strapi.server.httpServer)
      .put(path)
      .send({body})
      .set("accept", "application/json")
      .set("Authorization",`Bearer  ${jwt}`)
      .set("Content-Type", "application/json")
      .expect(405)
      .then((data) => {
        expect(data.error.text).toBe('Method Not Allowed');
      });
  });


});
