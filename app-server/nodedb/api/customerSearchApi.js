
(function(){

    var customerMethods = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var customerSearchApi = function customerSearchApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    customerSearchApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethods(this.response.config , this.tnxId);
        customer.searchCustomer(this.response.request.body , resHandle);
    };

    module.exports.customerSearchApi = function(rin , callback){
        var dApi = new customerSearchApi(rin , callback);
        dApi.requestApi();
    };
})();