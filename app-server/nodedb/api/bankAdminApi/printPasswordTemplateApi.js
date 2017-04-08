(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var printPasswordApi = function printPasswordApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    printPasswordApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.printPasswordTemplate(this.body , resHandle);
    };

    module.exports.printPasswordApi = function(rin , callback){
        var dApi = new printPasswordApi(rin , callback);
        dApi.requestApi();
    };
})();