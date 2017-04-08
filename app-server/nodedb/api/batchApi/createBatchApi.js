(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/batchMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var createBatchApi = function customerInquiryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    createBatchApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var batch = achMethod(this.response.config , this.tnxId);
        batch.addBatch(this.body  , resHandle);
    };

    module.exports.createBatchApi = function(rin , callback){

        var dApi = new createBatchApi(rin , callback);
        dApi.requestApi();
    };
})();