(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var userMailDeleteApi = function userMailDeleteApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    userMailDeleteApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.removeFromUserTrash(this.response.request.body , resHandle);
    };

    module.exports.userMailDeleteApi = function(rin , callback){
        var dApi = new userMailDeleteApi(rin , callback);
        dApi.requestApi();
    };
})();