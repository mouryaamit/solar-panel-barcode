(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/fileBatchProcessMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var batchProcessAchApi = function batchProcessAchApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    batchProcessAchApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var file = achMethod(this.response.config , this.tnxId);
        file.processBatch(this.body  , resHandle);
    };

    module.exports.batchProcessAchApi = function(rin , callback){

        var dApi = new batchProcessAchApi(rin , callback);
        dApi.requestApi();
    };
})();