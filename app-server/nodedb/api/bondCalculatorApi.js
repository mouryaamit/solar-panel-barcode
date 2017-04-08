(function(){

    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var bondCalculatorApi = function bondCalculatorApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    bondCalculatorApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethod(this.response.config , resHandle , this.tnxId);
        customer.calculateBond(this.response.request.body);
    };

    module.exports.bondCalculatorApi = function(rin , callback){
        var dApi = new bondCalculatorApi(rin , callback);
        dApi.requestApi();
    };
})();