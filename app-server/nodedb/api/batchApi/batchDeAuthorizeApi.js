(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/batchMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var batchDeAuthorizeApi = function batchDeAuthorizeApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    batchDeAuthorizeApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var batch = achMethod(this.response.config , this.tnxId);
        batch.declineBatch(this.body  , resHandle);
    };

    module.exports.batchDeAuthorizeApi = function(rin , callback){

        var dApi = new batchDeAuthorizeApi(rin , callback);
        dApi.requestApi();
    };
})();