(function(){

    var alertMethod = require('../../../apiMethods/alertMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var addAlertApi = function addAlertApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    addAlertApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var alert = alertMethod(this.response.config , this.tnxId);
        alert.addAlerts(this.response.request.body , resHandle);
    };

    module.exports.addAlertApi = function(rin , callback){
        var dApi = new addAlertApi(rin , callback);
        dApi.requestApi();
    };
})();