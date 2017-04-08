(function(){

    var userMethod = require('../apiMethods/userMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var fundsTransferLogsApi = function fundsTransferLogsApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    fundsTransferLogsApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.fundsTransferLogs(this.response.request.body,resHandle);
    };

    module.exports.fundsTransferLogsApi = function(rin , callback){

        var dApi = new fundsTransferLogsApi(rin , callback);
        dApi.requestApi();
    };
})();