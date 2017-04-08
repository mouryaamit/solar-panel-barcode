(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var exclusionSearchUserApi = function exclusionSearchUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    exclusionSearchUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.searchForCustomerExclusion(this.body , resHandle);
    };

    module.exports.exclusionSearchUserApi = function(rin , callback){
        var dApi = new exclusionSearchUserApi(rin , callback);
        dApi.requestApi();
    };
})();