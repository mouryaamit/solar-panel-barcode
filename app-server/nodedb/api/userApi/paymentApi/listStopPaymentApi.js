(function(){

    var stopPaymentMethod = require('../../../apiMethods/stopPaymentMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var listStopPaymentApi = function listStopPaymentApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listStopPaymentApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var payment = stopPaymentMethod(this.response.config , this.tnxId);
        payment.listPayments(this.response.request.body , resHandle);
    };

    module.exports.listStopPaymentApi = function(rin , callback){
        var dApi = new listStopPaymentApi(rin , callback);
        dApi.requestApi();
    };
})();