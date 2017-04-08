(function(){

    var pageHitMethod = require('../../apiMethods/pageHitMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var pageHitPageReportApi = function pageHitPageReportApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    pageHitPageReportApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var pageHit = pageHitMethod(this.response.config , this.tnxId);
        pageHit.findUserTotalOverview(this.body , resHandle);
    };

    module.exports.pageHitPageReportApi = function(rin , callback){
        var dApi = new pageHitPageReportApi(rin , callback);
        dApi.requestApi();
    };
})();