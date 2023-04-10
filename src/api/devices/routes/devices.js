module.exports = {
  routes: [
    {
      "method": "POST",
      "path": "/devices",
      "handler": "devices.update",
      "config": {
        "policies": []
      }
    },
    {
      "method": "PUT",
      "path": "/devices/:oldExpoPushToken",
      "handler": "devices.update",
      "config": {
        "policies": []
      }
    },
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
