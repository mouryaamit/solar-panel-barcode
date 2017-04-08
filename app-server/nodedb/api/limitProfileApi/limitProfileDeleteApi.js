(function(){

    var limitProfileMethods = require('../../apiMethods/limitProfileMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var limitProfileDeleteApi = function limitProfileDeleteApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    limitProfileDeleteApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var limitProfile = limitProfileMethods(this.response.config , this.tnxId);
        limitProfile.deleteProfile(this.response.request.body , resHandle);
    };

    module.exports.limitProfileDeleteApi = function(rin , callback){

        var api = new limitProfileDeleteApi(rin , callback);
        api.requestApi();
    };
})();