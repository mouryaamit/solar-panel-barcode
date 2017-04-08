(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var changeSUPApi = function changeSUPApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    changeSUPApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.changeSubuserProfile(this.response.request.body , resHandle);
    };

    module.exports.changeSUPApi = function(rin , callback){

        var dApi = new changeSUPApi(rin , callback);
        dApi.requestApi();
    };
})();