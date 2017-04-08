(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/fileBatchProcessMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var batchRemoveAchApi = function batchRemoveAchApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    batchRemoveAchApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var file = achMethod(this.response.config , this.tnxId);
        file.deleteBatch(this.body  , resHandle);
    };

    module.exports.batchRemoveAchApi = function(rin , callback){

        var dApi = new batchRemoveAchApi(rin , callback);
        dApi.requestApi();
    };
})();