(function(){

    var mailWordingMethod = require('../../apiMethods/mailWordingMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var addWordingApi = function addWordingApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    addWordingApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var wording = mailWordingMethod(this.response.config , this.tnxId);
        wording.addMailWording(this.body , resHandle);
    };

    module.exports.addWordingApi = function(rin , callback){
        var dApi = new addWordingApi(rin , callback);
        dApi.requestApi();
    };
})();