require('dotenv/config')

module.exports = ({ env }) => ({
  host: process.env.HOST,//env('HOST', '0.0.0.0'),
  port: process.env.PORT,//env.int('PORT', 1337),
  admin: {
    auth: {
      secret: process.env.ADMIN_JWT_SECRET//env('ADMIN_JWT_SECRET', '0e27e090442b2cd90116cbdbd5b80b1f'),
    },
  },
});
