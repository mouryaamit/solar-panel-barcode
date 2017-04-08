(function(){

    var limitProfileMethods = require('../../apiMethods/limitProfileMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var limitProfileUsersListApi = function limitProfileUsersListApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    limitProfileUsersListApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var limitProfile = limitProfileMethods(this.response.config , this.tnxId);
        limitProfile.listLimitProfileUsers(this.response.request.body , resHandle);
    };

    module.exports.limitProfileUsersListApi = function(rin , callback){

        var api = new limitProfileUsersListApi(rin , callback);
        api.requestApi();
    };
})();