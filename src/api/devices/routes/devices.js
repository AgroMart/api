module.exports = {
  routes: [
    /*
  todo: 
  test salvo no banco
  test body nao enviado
  test body com atributos a mais
  test body com atributos faltantes
  test outros parametros enviados em conjunto
  */
    {
      "method": "POST",
      "path": "/devices",
      "handler": "devices.update",
      "config": {
        "policies": []
      }
    },
    /*
  todo: 
  test salvo no banco
  test body nao enviado
  test body com atributos a mais
  test body com atributos faltantes
  test nenhum parametro enviado
  test oldExpoPushToken não enviado
  test outros parametros enviados em conjunto
  */
    {
      "method": "PUT",
      "path": "/devices/:oldExpoPushToken",
      "handler": "devices.update",
      "config": {
        "policies": []
      }
    },
    /*
  todo:
  test user nao encontrado
  test nenhum parametro enviado
  test user_id não enviado
  test outros parametros enviados em conjunto
  */
    {
      "method": "GET",
      "path": "/devices/user/:user_id",
      "handler": "devices.findUserExpoPushToken",
      "config": {
        "policies": []
      }
    }
  ],
};
