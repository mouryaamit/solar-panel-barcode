(function(){

    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var customerAccountApi = function customerAccountApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    customerAccountApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethod(this.response.config , resHandle , this.tnxId);
        customer.directInquiryCustomer(this.response.request.body);
    };

    module.exports.customerAccountApi = function(rin , callback){

        var dApi = new customerAccountApi(rin , callback);
        dApi.requestApi();
    };
})();