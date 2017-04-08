(function(){

    var siteCustomisationMethod = require('../../../apiMethods/siteCustomisationMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var applySiteOverviewChangeApi = function applySiteOverviewChangeApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    applySiteOverviewChangeApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var site = siteCustomisationMethod(this.response.config , this.tnxId);
        site.applySiteOverviewChanges(this.body , resHandle);
    };

    module.exports.applySiteOverviewChangeApi = function(rin , callback){
        var dApi = new applySiteOverviewChangeApi(rin , callback);
        dApi.requestApi();
    };
})();