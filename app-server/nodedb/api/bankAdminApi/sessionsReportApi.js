(function(){

    var sessionReportMethod = require('../../apiMethods/sessionReportMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var sessionsReportApi = function sessionsReportApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    sessionsReportApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var session = sessionReportMethod(this.response.config , this.tnxId);
        session.getSessionReport(this.body , resHandle);
    };

    module.exports.sessionsReportApi = function(rin , callback){
        var dApi = new sessionsReportApi(rin , callback);
        dApi.requestApi();
    };
})();