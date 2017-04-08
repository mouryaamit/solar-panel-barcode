(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var searchUserApi = function searchUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    searchUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.searchForAdmin(this.body , resHandle);
    };

    module.exports.searchUserApi = function(rin , callback){
        var dApi = new searchUserApi(rin , callback);
        dApi.requestApi();
    };
})();