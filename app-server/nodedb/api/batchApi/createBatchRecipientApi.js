(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/recipientMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var createRecipientApi = function createRecipientApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    createRecipientApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var recipient = achMethod(this.response.config , this.tnxId);
        recipient.addRecipient(this.body  , resHandle);
    };

    module.exports.createRecipientApi = function(rin , callback){

        var dApi = new createRecipientApi(rin , callback);
        dApi.requestApi();
    };
})();