(function(){

    var alertMethod = require('../../../apiMethods/alertMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var listAlertApi = function listAlertApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listAlertApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var alert = alertMethod(this.response.config , this.tnxId);
        alert.listAlerts(this.response.request.body , resHandle);
    };

    module.exports.listAlertApi = function(rin , callback){
        var dApi = new listAlertApi(rin , callback);
        dApi.requestApi();
    };
})();