(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var reconciliationUsersReportApi = function reconciliationUsersReportApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    reconciliationUsersReportApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.getReconciliationUserReport(this.response.request.body , resHandle);
    };

    module.exports.reconciliationUsersReportApi = function(rin , callback){
        var dApi = new reconciliationUsersReportApi(rin , callback);
        dApi.requestApi();
    };
})();