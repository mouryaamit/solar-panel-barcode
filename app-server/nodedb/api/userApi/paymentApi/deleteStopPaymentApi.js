(function(){

    var stopPaymentMethod = require('../../../apiMethods/stopPaymentMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var deleteStopPaymentApi = function deleteStopPaymentApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    deleteStopPaymentApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var payment = stopPaymentMethod(this.response.config , this.tnxId);
        payment.deletePayments(this.response.request.body , resHandle);
    };

    module.exports.deleteStopPaymentApi = function(rin , callback){
        var dApi = new deleteStopPaymentApi(rin , callback);
        dApi.requestApi();
    };
})();