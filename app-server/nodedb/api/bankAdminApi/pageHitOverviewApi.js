(function(){

    var pageHitMethod = require('../../apiMethods/pageHitMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var pageHitOverviewReportApi = function pageHitOverviewReportApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    pageHitOverviewReportApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var pageHit = pageHitMethod(this.response.config , this.tnxId);
        pageHit.findTotalOverview(this.body , resHandle);
    };

    module.exports.pageHitOverviewReportApi = function(rin , callback){
        var dApi = new pageHitOverviewReportApi(rin , callback);
        dApi.requestApi();
    };
})();