module.exports = {
  routes: [
    {
      "method": "GET",
      "path": "/notificacoes",
      "handler": "notificacao.find",
      "config": {
        "policies": []
      }
    }
  ],
};
