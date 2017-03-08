(function(){

    var koa = require('koa');

    var middleware = require('./nodedb/lib/prop/middleware');

    var loadMultipleDatabases = require('./nodedb/databases/databaseManager');

    var port = process.argv[2];
	
	if(!port){
		console.log("Please specify the Port for application")
	} else {

		//Load Database
		loadMultipleDatabases(null, process.argv[2]);

		//Load Middleware
		var app = koa();
		middleware(app);

		//On error
		app.on('error', function(err , ctx){
			console.log('server error', err.stack);
			console.log('server error', err , ctx);
			var responseError = { status: 409 , responseData: {message: 'Incorrect Request'}};
			if(ctx.method == "POST") {
				ctx.status = 409;
				ctx.res.writeHead(409, {'Content-Type': 'application/json'});
				ctx.res.write(JSON.stringify(responseError));
				ctx.res.end();
			}
		});

		app.listen(port);
		console.log("listening to "+port);

		process.on('uncaughtException', function (err) {
			console.error(err.stack);
			console.log("Uncaught Error Occurred. Handling Error and Reporting log");
		});

		process.on('error', function (err) {
			console.error(err.stack);
			console.log("Process Error Occurred. Handling Error and Reporting log");
		});
	}
})();