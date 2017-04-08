(function(){

    var stopPaymentMethod = require('../../../apiMethods/stopPaymentMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var addStopPaymentApi = function addStopPaymentApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    addStopPaymentApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var payment = stopPaymentMethod(this.response.config , this.tnxId);
        payment.addStopPayment(this.response.request.body , resHandle);
    };

    module.exports.addStopPaymentApi = function(rin , callback){
        var dApi = new addStopPaymentApi(rin , callback);
        dApi.requestApi();
    };
})();