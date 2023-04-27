const defaultRoute = require('./defaultRoutes');

module.exports = () => {
  return async (ctx, next) => {
    // Verifica se a URL não começa com "/api"
    if (!ctx.url.startsWith('/api/') 
        && !defaultRoute.isDefaultRoute(ctx.url)) {
      // Redireciona para a mesma URL com o prefixo "/api" adicionado
      ctx.url = `/api${ctx.url}`;
    }
    await next();
  };
};
