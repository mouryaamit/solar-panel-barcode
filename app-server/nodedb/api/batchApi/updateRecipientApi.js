(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/recipientMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var recipientUpdateApi = function recipientUpdateApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    recipientUpdateApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var recipient = achMethod(this.response.config , this.tnxId);
        recipient.updateRecipient(this.body  , resHandle);
    };

    module.exports.recipientUpdateApi = function(rin , callback){

        var dApi = new recipientUpdateApi(rin , callback);
        dApi.requestApi();
    };
})();