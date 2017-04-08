(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/recipientMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var recipientRemoveApi = function recipientRemoveApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    recipientRemoveApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var recipient = achMethod(this.response.config , this.tnxId);
        recipient.removeRecipient(this.body  , resHandle);
    };

    module.exports.recipientRemoveApi = function(rin , callback){

        var dApi = new recipientRemoveApi(rin , callback);
        dApi.requestApi();
    };
})();