(function(){

    var pageHitMethod = require('../../apiMethods/pageHitMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var pageHitCustomerReportApi = function pageHitCustomerReportApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    pageHitCustomerReportApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var pageHit = pageHitMethod(this.response.config , this.tnxId);
        pageHit.findUserReport(this.body , resHandle);
    };

    module.exports.pageHitCustomerReportApi = function(rin , callback){
        var dApi = new pageHitCustomerReportApi(rin , callback);
        dApi.requestApi();
    };
})();