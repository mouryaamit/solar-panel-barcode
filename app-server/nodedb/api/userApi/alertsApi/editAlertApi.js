(function(){

    var alertMethod = require('../../../apiMethods/alertMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var editAlertApi = function editAlertApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    editAlertApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var alert = alertMethod(this.response.config , this.tnxId);
        alert.editAlert(this.response.request.body , resHandle);
    };

    module.exports.editAlertApi = function(rin , callback){
        var dApi = new editAlertApi(rin , callback);
        dApi.requestApi();
    };
})();