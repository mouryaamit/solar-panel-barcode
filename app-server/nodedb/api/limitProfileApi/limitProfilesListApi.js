(function(){

    var limitProfileMethods = require('../../apiMethods/limitProfileMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var limitProfilesListApi = function limitProfilesListApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    limitProfilesListApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var limitProfile = limitProfileMethods(this.response.config , this.tnxId);
        limitProfile.listLimitProfiles(this.response.request.body , resHandle);
    };

    module.exports.limitProfilesListApi = function(rin , callback){

        var api = new limitProfilesListApi(rin , callback);
        api.requestApi();
    };
})();