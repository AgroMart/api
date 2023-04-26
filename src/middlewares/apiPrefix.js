module.exports = () => {
  return async (ctx, next) => {
    // Verifica se a URL não começa com "/api"
    if (!ctx.url.startsWith('/api/') 
        && !ctx.url.startsWith('/admin')
        && !ctx.url.startsWith('/i18n/locales')
        && !ctx.url.startsWith('/content')
        && !ctx.url.startsWith('/upload')
        && !ctx.url.startsWith('/expo-notifications')
        && !ctx.url.startsWith('/plugins')
        && !ctx.url.startsWith('/users-permissions')
        && !ctx.url.startsWith('/auth/google')
        && !ctx.url.startsWith('/auth/facebook')
        && !ctx.url.startsWith('/auth/github')
        && !ctx.url.startsWith('/email')
        && ctx.url != '/'
        && ctx.url != '' ) {
      // Redireciona para a mesma URL com o prefixo "/api" adicionado
      ctx.url = `/api${ctx.url}`;
    }
    await next();
  };
};
