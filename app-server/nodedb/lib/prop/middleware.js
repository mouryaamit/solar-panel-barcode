(function(){

    var path = require('path');
    var routing = require('koa-routing');
    var bodyParser = require('koa-body');
    var scheme = require('koa-scheme');
    var session = require('koa-generic-session');
    var redisStore = require('koa-redis');
    var serve = require('koa-static');
    var randomID = require("random-id");
    //var csrf = require('koa-csrf');
    // var morgan = require('koa-morgan');
    // var fs = require('fs')
    // var FileStreamRotator = require('file-stream-rotator')

    var schemeValidator = require('../../router/routeValidator');
    var config = require('./serverConfig');
    var serverErrors = require('./serverErrors')();

    // var logDirectory = __dirname + '/../../../logs'

    // ensure log directory exists
    // fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

    // create a rotating write stream
    // var accessLogStream = FileStreamRotator.getStream({
    //     filename: logDirectory + '/access-%DATE%.log',
    //     frequency: '3h',
    //     verbose: true,
    //     date_format: "YYYY-MM-DD-HH"
    // })

    module.exports = middleware;

    function middleware (app){

        // logger
        // morgan.token('remote-addr', function (req, res) {
        //     return req.headers['x-real-ip']
        // });
        // morgan.token('inst-id', function (req, res) {
        //     return req.headers['x-inst-id']
        // });
        // morgan.token('date', function (req, res) {
        //     return new Date().toUTCString();
        // });
        // app.use(morgan.middleware('--> [:inst-id] [:date] :remote-addr ":method :url HTTP/:http-version"', {stream: accessLogStream,immediate: true}));
        // app.use(morgan.middleware('<-- [:inst-id] [:date] :remote-addr ":method :url HTTP/:http-version" :status', {stream: accessLogStream,immediate: false}));

        app.use(function *(next){
            var start = new Date;
            yield next;
            var ms = new Date - start;
            //this.set('X-Response-Time', ms + 'ms');
            console.info('method- %s url- %s time- %s ms status- %s Inst: %s Transaction Id: %s', this.method, this.url, ms , this.status, this.headers['x-inst-id'], this.headers['x-request-id'] != (undefined || null) ? this.headers['x-request-id'] : "");
        });

        //Body Parser
        app.use(bodyParser({jsonLimit: '6mb', multipart: true , formidable:{uploadDir: path.normalize(__dirname + '../../../achUploadDir') , keepExtensions: true}}));

        //Session Handling
        app.keys = ['V$0F71R1$D1G17AL8ANK1NG'];

        var ses = {
            key : 'IRIS-Digital-Banking',
            maxAge: 24000 * 60 * 60,
            path: '/',
            allowEmpty:false,
            httpOnly: false,
            signed: true,
            cookie: {
                maxAge: 24000 * 60 * 60,
                path: '/',
                httpOnly: false,
                signed: true
            },
        };

        if(config().getConfig().redisStore.isEnabled){
            ses.store = redisStore({
                host:config().getConfig().redisStore.host,
                port:config().getConfig().redisStore.port
            })
        }

        app.use(session(ses));

        //Config Specific Vendor
        app.use(function *(next){
            var configFile = this.header['x-config'] || 'iris';
            this.config = config(configFile);
            yield next;

        });

        //Request/Response Body Validation
        //app.use(scheme(schemeValidator));

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