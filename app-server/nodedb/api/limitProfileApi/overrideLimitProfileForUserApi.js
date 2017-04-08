(function(){

    var limitProfileMethods = require('../../apiMethods/limitProfileMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var overrideLimitProfileForUserApi = function overrideLimitProfileForUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    overrideLimitProfileForUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var limitProfile = limitProfileMethods(this.response.config , this.tnxId);
        limitProfile.overrideLimitProfileForUser(this.response.request.body , resHandle);
    };

    module.exports.overrideLimitProfileForUserApi = function(rin , callback){

        var api = new overrideLimitProfileForUserApi(rin , callback);
        api.requestApi();
    };
})();