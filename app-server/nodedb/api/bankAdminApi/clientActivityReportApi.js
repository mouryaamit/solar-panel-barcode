(function(){

    var clientActivityMethod = require('../../apiMethods/clientActivityMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var clientActivityApi = function clientActivityApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    clientActivityApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = clientActivityMethod(this.response.config , this.tnxId);
        user.getClientActivityReport(this.response.request.body , resHandle);
    };

    module.exports.clientActivityApi = function(rin , callback){
        var dApi = new clientActivityApi(rin , callback);
        dApi.requestApi();
    };
})();