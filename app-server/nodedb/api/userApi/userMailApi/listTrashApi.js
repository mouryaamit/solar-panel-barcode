(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var userMailTrashApi = function userMailTrashApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    userMailTrashApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.showUserTrashBox(this.response.request.body , resHandle);
    };

    module.exports.userMailTrashApi = function(rin , callback){
        var dApi = new userMailTrashApi(rin , callback);
        dApi.requestApi();
    };
})();