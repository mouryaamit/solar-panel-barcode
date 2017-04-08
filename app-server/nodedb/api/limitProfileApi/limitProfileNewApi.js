(function(){

    var limitProfileMethods = require('../../apiMethods/limitProfileMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var limitProfileNewApi = function limitProfileNewApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    limitProfileNewApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var limitProfile = limitProfileMethods(this.response.config , this.tnxId);
        limitProfile.addNewProfile(this.response.request.body , resHandle);
    };

    module.exports.limitProfileNewApi = function(rin , callback){

        var api = new limitProfileNewApi(rin , callback);
        api.requestApi();
    };
})();