(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var findUserApi = function findUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    findUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.findUsers(this.response.request.body , resHandle);
    };

    module.exports.findUserApi = function(rin , callback){
        var dApi = new findUserApi(rin , callback);
        dApi.requestApi();
    };
})();