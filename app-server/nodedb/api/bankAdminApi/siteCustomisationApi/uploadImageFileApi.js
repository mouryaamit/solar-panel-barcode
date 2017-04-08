(function(){

    var siteCustomisationMethod = require('../../../apiMethods/siteCustomisationMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var uploadSiteImageApi = function uploadSiteImageApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    uploadSiteImageApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var site = siteCustomisationMethod(this.response.config , this.tnxId);
        site.uploadFiles(this.body , resHandle);
    };

    module.exports.uploadSiteImageApi = function(rin , callback){
        var dApi = new uploadSiteImageApi(rin , callback);
        dApi.requestApi();
    };
})();