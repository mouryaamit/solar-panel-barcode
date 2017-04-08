(function(){

    var siteCustomisationMethod = require('../../../apiMethods/siteCustomisationMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var listSiteImageApi = function listSiteImageApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listSiteImageApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var site = siteCustomisationMethod(this.response.config , this.tnxId);
        site.listUploadedFiles(this.body , resHandle);
    };

    module.exports.listSiteImageApi = function(rin , callback){
        var dApi = new listSiteImageApi(rin , callback);
        dApi.requestApi();
    };
})();