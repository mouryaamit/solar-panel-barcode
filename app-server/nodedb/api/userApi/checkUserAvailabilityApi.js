(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var checkAvailabilityApi = function checkAvailabilityApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    checkAvailabilityApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.checkAvailability(this.response.request.body , resHandle);
    };

    module.exports.checkAvailabilityApi = function(rin , callback){
        var dApi = new checkAvailabilityApi(rin , callback);
        dApi.requestApi();
    };
})();