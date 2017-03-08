(function(){

    var path = require('path');

    var router = require('./route');

    module.exports = function (app) {

        app.route('/genrateBarcode')
            .get(function * (next) {
                this.callApi = router.apiCalls.genrateBarcode;
                yield router.route(app , this);
            })

    };
})();