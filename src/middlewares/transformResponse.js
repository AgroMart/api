const defaultRoute = require('./defaultRoutes');

module.exports = () => {
    return async (ctx, next) => {
        await next();

        if (ctx.res.headersSent) {
          return;
        }
        if (ctx.response.body 
            && ctx.response.body.data
            && !defaultRoute.isDefaultRoute(ctx.url)) {
            let data = ctx.response.body.data;

            if(data.attributes){
                const id = data.id;
                data = data.attributes;
                data.id = id;
            }

            if(Array.isArray(data)){
                arr = []
                for (const item in data){
                    if(item.attributes){
                        const id = item.id;
                        temp = item.attributes;
                        temp.id = id;
                        arr.push(temp);
                    }
                }
                data = arr;
            }
            
            ctx.response.body = data;
        }

    };   
};
