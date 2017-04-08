(function(){

    var alertMethod = require('../../../apiMethods/alertMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var deleteAlertApi = function deleteAlertApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    deleteAlertApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var alert = alertMethod(this.response.config , this.tnxId);
        alert.deleteAlerts(this.response.request.body , resHandle);
    };

    module.exports.deleteAlertApi = function(rin , callback){
        var dApi = new deleteAlertApi(rin , callback);
        dApi.requestApi();
    };
})();