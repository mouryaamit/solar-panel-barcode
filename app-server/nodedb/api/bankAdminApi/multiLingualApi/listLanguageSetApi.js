(function(){

    var multiLingualMethod = require('../../../apiMethods/multiLingualMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var listLanguageSetApi = function listLanguageSetApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listLanguageSetApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var multiLingual = multiLingualMethod(this.response.config , this.tnxId);
        multiLingual.listInstituteLang(this.body , resHandle);
    };

    module.exports.listLanguageSetApi = function(rin , callback){
        var dApi = new listLanguageSetApi(rin , callback);
        dApi.requestApi();
    };
})();