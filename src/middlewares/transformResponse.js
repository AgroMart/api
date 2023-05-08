const defaultRoute = require('./helpers/defaultRoutes');
const transformObject = require('./helpers/transformObject');

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
                data = transformObject.transformObjectKeys(data)
            } else if(Array.isArray(data)){
                arr = []
                data.forEach(item => {
                    if(item.attributes){
                        const id = item.id;
                        temp = item.attributes;
                        temp.id = id;
                        arr.push(transformObject.transformObjectKeys(temp));
                    }
                })
                data = arr;
            }
            
            console.log(data)
            ctx.response.body = data;
        }

    };   
};
