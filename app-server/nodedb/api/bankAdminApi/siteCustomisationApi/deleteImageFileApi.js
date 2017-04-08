(function(){

    var siteCustomisationMethod = require('../../../apiMethods/siteCustomisationMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var deleteSiteImageApi = function deleteSiteImageApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    deleteSiteImageApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var site = siteCustomisationMethod(this.response.config , this.tnxId);
        site.deleteUploadedFile(this.body , resHandle);
    };

    module.exports.deleteSiteImageApi = function(rin , callback){
        var dApi = new deleteSiteImageApi(rin , callback);
        dApi.requestApi();
    };
})();