(function(){

    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var getStatementFileApi = function getStatementFileApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    getStatementFileApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethod(this.response.config , resHandle , this.tnxId);
        customer.getStatementFile(this.response.request.body);
    };

    module.exports.getStatementFileApi = function(rin , callback){
        var dApi = new getStatementFileApi(rin , callback);
        dApi.requestApi();
    };
})();