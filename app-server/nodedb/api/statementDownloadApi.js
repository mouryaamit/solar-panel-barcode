(function(){

    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var statementDownloadApi = function statementDownloadApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    statementDownloadApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethod(this.response.config , resHandle , this.tnxId);
        customer.statementDownload(this.response.request.body);
    };

    module.exports.statementDownloadApi = function(rin , callback){
        var dApi = new statementDownloadApi(rin , callback);
        dApi.requestApi();
    };
})();