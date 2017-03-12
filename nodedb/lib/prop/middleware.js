(function(){

    var path = require('path');
    var routing = require('koa-routing');
    var bodyParser = require('koa-body');
    var scheme = require('koa-scheme');
    var session = require('koa-generic-session');
    var serve = require('koa-static');
    var randomID = require("random-id");
    var cors = require('koa-cors');

    var schemeValidator = require('../../router/routeValidator');
    var config = require('./serverConfig');
    var serverErrors = require('./serverErrors')();

    module.exports = middleware;

    function middleware (app){
        app.use(cors());

        app.use(function *(next){
            var start = new Date;
            yield next;
            var ms = new Date - start;
            //this.set('X-Response-Time', ms + 'ms');
            console.log('method- %s url- %s time- %s ms status- %s Inst: %s Transaction Id: %s', this.method, this.url, ms , this.status, this.headers['x-inst-id'], this.headers['X-Request-Id'] != (undefined || null) ? this.headers['X-Request-Id'] : "");
        });

        //Body Parser
        app.use(bodyParser({jsonLimit: '6mb', multipart: true }));

        //Session Handling . Session Key
        app.keys = ['catKeyBoard'];

        var ses = {
            key : 'solar-panel',
            httpOnly : true,
            rewrite: true,
            signed: true
        };

        app.use(session(ses , app));

        //Config Specific Vendor
        app.use(function *(next){
            var configFile = this.header['x-config'] || 'iris';
            this.config = config(configFile);
            yield next;

        });

        //Request/Response Body Validation
        app.use(scheme(schemeValidator));

        //Routing
        app.use(routing(app));

        //Load Routes
        var route = require('../../router/routeHandler')(app);

        //Handle redundant Url for all Vendors
        app.use(function *(){
            this.status = 404;
            this.body = serverErrors['404'];
        });

        return app;
    }
})();