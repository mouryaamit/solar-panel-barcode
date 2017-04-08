(function(){

    var achMethod = require('../../apiMethods/batchMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var listEditableBatchApi = function listEditableBatchApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listEditableBatchApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var batch = achMethod(this.response.config , this.tnxId);
        batch.retrieveEditableBatch(this.body , resHandle);
    };

    module.exports.listEditableBatchApi = function(rin , callback){
        var dApi = new listEditableBatchApi(rin , callback);
        dApi.requestApi();
    };
})();