(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var adminMailTrashApi = function adminMailTrashApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    adminMailTrashApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.showAdminTrashBox(this.response.request.body , resHandle);
    };

    module.exports.adminMailTrashApi = function(rin , callback){
        var dApi = new adminMailTrashApi(rin , callback);
        dApi.requestApi();
    };
})();