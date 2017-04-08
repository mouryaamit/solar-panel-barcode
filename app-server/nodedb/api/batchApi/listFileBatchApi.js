(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/achFileMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var listFileBatchApi = function listFileBatchApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listFileBatchApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var file = achMethod(this.response.config , this.tnxId);
        file.listBatchByFileId(this.body  , resHandle);
    };

    module.exports.listFileBatchApi = function(rin , callback){

        var dApi = new listFileBatchApi(rin , callback);
        dApi.requestApi();
    };
})();