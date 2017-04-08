(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var printUserIdApi = function printUserIdApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    printUserIdApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.printUserIdTemplate(this.body , resHandle);
    };

    module.exports.printUserIdApi = function(rin , callback){
        var dApi = new printUserIdApi(rin , callback);
        dApi.requestApi();
    };
})();