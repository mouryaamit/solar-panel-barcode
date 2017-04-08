(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var listUserApi = function listUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.listCreatedUser(this.response.request.body , resHandle);
    };

    module.exports.listUserApi = function(rin , callback){

        var dApi = new listUserApi(rin , callback);
        dApi.requestApi();
    };
})();