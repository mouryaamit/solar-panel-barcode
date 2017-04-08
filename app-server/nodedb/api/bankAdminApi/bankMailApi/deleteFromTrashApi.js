(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var adminMailDeleteApi = function adminMailDeleteApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    adminMailDeleteApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.removeFromAdminTrash(this.response.request.body , resHandle);
    };

    module.exports.adminMailDeleteApi = function(rin , callback){
        var dApi = new adminMailDeleteApi(rin , callback);
        dApi.requestApi();
    };
})();