(function(){

    var achMethod = require('../../apiMethods/batchMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var reinitiateACHBatchApi = function customerInquiryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    reinitiateACHBatchApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var batch = achMethod(this.response.config , this.tnxId);
        batch.reinitiateACHBatch(this.body  , resHandle);
    };

    module.exports.reinitiateACHBatchApi = function(rin , callback){

        var dApi = new reinitiateACHBatchApi(rin , callback);
        dApi.requestApi();
    };
})();