(function(){

    var mailWordingMethod = require('../../apiMethods/mailWordingMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var getWordingApi = function getWordingApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    getWordingApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var wording = mailWordingMethod(this.response.config , this.tnxId);
        wording.getMailWording(this.body , resHandle);
    };

    module.exports.getWordingApi = function(rin , callback){
        var dApi = new getWordingApi(rin , callback);
        dApi.requestApi();
    };
})();