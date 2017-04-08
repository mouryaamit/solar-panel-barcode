(function(){

    var siteCustomisationMethod = require('../../../apiMethods/siteCustomisationMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var applySiteChangeApi = function applySiteChangeApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    applySiteChangeApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var site = siteCustomisationMethod(this.response.config , this.tnxId);
        site.applySiteChanges(this.body , resHandle);
    };

    module.exports.applySiteChangeApi = function(rin , callback){
        var dApi = new applySiteChangeApi(rin , callback);
        dApi.requestApi();
    };
})();