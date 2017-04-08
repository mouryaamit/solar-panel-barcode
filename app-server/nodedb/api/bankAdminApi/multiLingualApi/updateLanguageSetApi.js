(function(){

    var multiLingualMethod = require('../../../apiMethods/multiLingualMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var updateLanguageSetApi = function updateLanguageSetApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    updateLanguageSetApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var multiLingual = multiLingualMethod(this.response.config , this.tnxId);
        multiLingual.addInstituteLang(this.body , resHandle);
    };

    module.exports.updateLanguageSetApi = function(rin , callback){
        var dApi = new updateLanguageSetApi(rin , callback);
        dApi.requestApi();
    };
})();