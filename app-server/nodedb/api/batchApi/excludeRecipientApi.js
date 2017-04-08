(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/recipientMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var recipientExcludeApi = function recipientExcludeApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    recipientExcludeApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var recipient = achMethod(this.response.config , this.tnxId);
        recipient.excludeRecipient(this.body  , resHandle);
    };

    module.exports.recipientExcludeApi = function(rin , callback){

        var dApi = new recipientExcludeApi(rin , callback);
        dApi.requestApi();
    };
})();