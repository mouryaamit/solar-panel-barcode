(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/batchMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var batchAuthorizeApi = function batchAuthorizeApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    batchAuthorizeApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var batch = achMethod(this.response.config , this.tnxId);
        batch.authorizeBatch(this.body  , resHandle);
    };

    module.exports.batchAuthorizeApi = function(rin , callback){

        var dApi = new batchAuthorizeApi(rin , callback);
        dApi.requestApi();
    };
})();