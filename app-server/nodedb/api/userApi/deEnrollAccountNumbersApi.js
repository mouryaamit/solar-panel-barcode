(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var deEnrollAccountNumbersApi = function deleteAlertApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    deEnrollAccountNumbersApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.deEnrollAccountNumbers(this.response.request.body , resHandle);
    };

    module.exports.deEnrollAccountNumbersApi = function(rin , callback){
        var dApi = new deEnrollAccountNumbersApi(rin , callback);
        dApi.requestApi();
    };
})();
