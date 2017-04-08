(function(){

    var pageHitMethod = require('../apiMethods/pageHitMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var pageHitApi = function pageHitApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    pageHitApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var pageHit = pageHitMethod(this.response.config , this.tnxId);
        pageHit.addPageHitReport(this.response.request.body , resHandle);
    };

    module.exports.pageHitApi = function(rin , callback){
        var dApi = new pageHitApi(rin , callback);
        dApi.requestApi();
    };
})();