(function(){

    var limitProfileMethods = require('../../apiMethods/limitProfileMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var limitProfileEditApi = function limitProfileEditApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    limitProfileEditApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var limitProfile = limitProfileMethods(this.response.config , this.tnxId);
        limitProfile.editProfile(this.response.request.body , resHandle);
    };

    module.exports.limitProfileEditApi = function(rin , callback){

        var api = new limitProfileEditApi(rin , callback);
        api.requestApi();
    };
})();