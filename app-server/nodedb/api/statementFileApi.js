(function(){

    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var statementFileApi = function statementFileApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    statementFileApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethod(this.response.config , resHandle , this.tnxId);
        customer.downloadStatement(this.response.request.body);
    };

    module.exports.statementFileApi = function(rin , callback){
        var dApi = new statementFileApi(rin , callback);
        dApi.requestApi();
    };
})();