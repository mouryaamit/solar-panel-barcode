(function(){

    var userMethods = require('../../../apiMethods/userMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var requestStatementEnrollment = function requestStatementEnrollment(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    requestStatementEnrollment.prototype.requestApi = function(){
        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var order = userMethods(this.response.config , this.tnxId);
        order.statementsEnrollment(this.response.request.body , resHandle);
    };

    module.exports.requestStatementEnrollment = function(rin , callback){
        var dApi = new requestStatementEnrollment(rin , callback);
        dApi.requestApi();
    };
})();
