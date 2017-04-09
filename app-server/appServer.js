(function(){

    var koa = require('koa');

    var middleware = require('./nodedb/lib/prop/middleware');

    var loadMultipleDatabases = require('./nodedb/databases/databaseManager');

    var appServerManager = require('./nodedb/databases/appServerManager');

    var port = process.argv[2] || 3814;

    var logLevel = process.argv[4] || "i";

    // if(logLevel.toLowerCase() == "a"){
    //     console.info("*** Verbose Logger Running For ***")
    // } else if(logLevel.toLowerCase() == "d") {
    //     console.log = function(){};
    //     console.info("*** Debug Logger Running ***")
    // } else {
    //     console.log = function(){};
    //     console.warn = function(){};
    //     console.info("*** Information Logger Running ***")
    // }

    if(!port){
        console.error("Please specify the Port for application")
    } else {
        var protocol = process.argv[3] || 0; //0 for http, 1 for https

        //Load Database
        loadMultipleDatabases(appServerManager().serverHandler, process.argv[5]);

        //Load Middleware
        var app = koa();
        middleware(app);

        //On error
        app.on('error', function (err, ctx) {
            console.error('server error', err.stack);
            console.error('server error', err, ctx);
            var responseError = {status: 409, responseData: {message: 'Incorrect Request'}};
            if (ctx.method == "POST") {
                ctx.status = 409;
                ctx.res.writeHead(409, {'Content-Type': 'application/json'});
                ctx.res.write(JSON.stringify(responseError));
                ctx.res.end();
            }
        });

        // app.listen(port);
        if (protocol == 0) {
            var http = require('http');
            http.createServer(app.callback()).listen(port);
        } else {
            var https = require('https');

            var forceSSL = require('koa-force-ssl');

            var fs = require('fs');

            app.use(forceSSL());

            var options = {
                key: fs.readFileSync('server-' + port + '.key'),
                cert: fs.readFileSync('server-' + port + '.crt')
            };
            https.createServer(options, app.callback()).listen(port);
        }
        console.info("Server running on " + port + " with " + (protocol == 0 ? 'http' : 'https' ));

        process.on('uncaughtException', function (err) {
            console.error(err.stack);
            console.error("Uncaught Error Occurred");
        });

        process.on('error', function (err) {
            console.error(err.stack);
            console.error("Process Error Occurred");
        });
    }
})();