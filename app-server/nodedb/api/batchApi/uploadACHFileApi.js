(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/achFileMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var uploadAchApi = function uploadAchApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    uploadAchApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var file = achMethod(this.response.config , this.tnxId);
        file.uploadFile(this.body  , resHandle);
    };

    module.exports.uploadAchApi = function(rin , callback){

        var dApi = new uploadAchApi(rin , callback);
        dApi.requestApi();
    };
})();