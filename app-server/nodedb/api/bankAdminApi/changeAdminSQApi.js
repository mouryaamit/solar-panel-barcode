(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var changeAdminSQApi = function changeAdminSQApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    changeAdminSQApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var admin = bankAdminMethod(this.response.config , this.tnxId);
        admin.changeSecurityQuestion(this.response.request.body , resHandle);
    };

    module.exports.changeAdminSQApi = function(rin , callback){
        var dApi = new changeAdminSQApi(rin , callback);
        dApi.requestApi();
    };
})();