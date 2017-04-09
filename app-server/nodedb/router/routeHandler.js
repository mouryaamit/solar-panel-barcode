(function () {
    "use strict";

    var send = require('koa-send');

    var path = require('path');

    var router = require('./route');

    module.exports = function (app) {


        app.route('/solar-api/entry')
            .post(function *(next) {
                this.callApi = router.apiCalls.entry;
                yield router.route(app, this);
            });

        app.route('/solar-api/status')
            .post(function *(next) {
                this.callApi = router.apiCalls.status;
                yield router.route(app, this);
            });

        app.route('/solar-api/testing')
            .post(function *(next) {
                this.callApi = router.apiCalls.testing;
                yield router.route(app, this);
            });

    };
})();