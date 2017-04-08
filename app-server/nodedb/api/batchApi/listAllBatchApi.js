(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/batchMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var listAllBatchApi = function listAllBatchApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listAllBatchApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var batch = achMethod(this.response.config , this.tnxId);
        batch.retrieveAllBatch(this.body , resHandle);
    };

    module.exports.listAllBatchApi = function(rin , callback){

        var dApi = new listAllBatchApi(rin , callback);
        dApi.requestApi();
    };
})();