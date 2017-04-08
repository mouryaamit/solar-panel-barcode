(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/achFileMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var listUploadAchApi = function listUploadAchApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listUploadAchApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var file = achMethod(this.response.config , this.tnxId);
        file.listUploadedFiles(this.body  , resHandle);
    };

    module.exports.listUploadAchApi = function(rin , callback){

        var dApi = new listUploadAchApi(rin , callback);
        dApi.requestApi();
    };
})();