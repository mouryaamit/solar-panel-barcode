(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/batchMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var listPendingBatchApi = function listPendingBatchApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listPendingBatchApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var batch = achMethod(this.response.config , this.tnxId);
        batch.retrievePendingBatch(this.body , resHandle);
    };

    module.exports.listPendingBatchApi = function(rin , callback){

        var dApi = new listPendingBatchApi(rin , callback);
        dApi.requestApi();
    };
})();