(function(){

    var achMethod = require('../../apiMethods/batchMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var processACHBatchApi = function customerInquiryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    processACHBatchApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var batch = achMethod(this.response.config , this.tnxId);
        batch.processACHBatch(this.body  , resHandle);
    };

    module.exports.processACHBatchApi = function(rin , callback){

        var dApi = new processACHBatchApi(rin , callback);
        dApi.requestApi();
    };
})();