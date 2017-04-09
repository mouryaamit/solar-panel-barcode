(function(){

    var entryMethod = require('../../apiMethods/solar/entryMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var api = function api(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    api.prototype.requestApi = function(){
        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = entryMethod(this.response.config , this.tnxId);
        user.addEntry(this.body,resHandle);
    };

    module.exports.api = function(rin , callback){

        var dApi = new api(rin , callback);
        dApi.requestApi();
    };
})();