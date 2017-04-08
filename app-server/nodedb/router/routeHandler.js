(function () {
    "use strict";

    var send = require('koa-send');

    var path = require('path');

    var router = require('./route');

    module.exports = function (app) {


        app.route('/iris/keep/entry')
            .post(function *(next) {
                this.callApi = router.apiCalls.entry;
                yield router.route(app, this);
            });

    };
})();