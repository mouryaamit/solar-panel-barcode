(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/batchMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var batchDetailApi = function batchDetailApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    batchDetailApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var batch = achMethod(this.response.config , this.tnxId);
        batch.retrieveBatch(this.body  , resHandle);
    };

    module.exports.batchDetailApi = function(rin , callback){

        var dApi = new batchDetailApi(rin , callback);
        dApi.requestApi();
    };
})();