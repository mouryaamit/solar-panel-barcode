(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var adminAvailabilityApi = function adminAvailabilityApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    adminAvailabilityApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankAdmin = bankAdminMethod(this.response.config , this.tnxId);
        bankAdmin.checkAdminAvailability(this.response.request.body , resHandle);
    };

    module.exports.adminAvailabilityApi = function(rin , callback){
        var dApi = new adminAvailabilityApi(rin , callback);
        dApi.requestApi();
    };
})();