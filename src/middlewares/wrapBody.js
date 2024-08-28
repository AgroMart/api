const defaultRoute = require('./helpers/defaultRoutes');

module.exports = () => {
    return async (ctx, next) => {
        if (!("data" in ctx.request.body)
            && !defaultRoute.isDefaultRoute(ctx.url)
            && !ctx.url.startsWith('/api/auth/local')
            && !ctx.url.startsWith('/api/users')
            && !ctx.url.startsWith('/api/devices')) {
            ctx.request.body =  { data: ctx.request.body };
        }
        await next();
    };
};
