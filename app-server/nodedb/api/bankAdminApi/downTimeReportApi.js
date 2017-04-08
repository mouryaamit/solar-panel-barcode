(function(){

    var downTimeMethod = require('../../apiMethods/downTimeMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var downTimeReportApi = function downTimeReportApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    downTimeReportApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var downTime = downTimeMethod(this.response.config , this.tnxId);
        downTime.showDownTimeReport(this.body , resHandle);
    };

    module.exports.downTimeReportApi = function(rin , callback){
        var dApi = new downTimeReportApi(rin , callback);
        dApi.requestApi();
    };
})();