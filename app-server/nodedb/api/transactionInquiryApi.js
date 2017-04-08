(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var transactionInquiryApi = function transactionInquiryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    transactionInquiryApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethod(this.response.config , resHandle , this.tnxId);
        customer.inquiryTransaction(this.response.request.body);
    };

    module.exports.transactionInquiryApi = function(rin , callback){

        var dApi = new transactionInquiryApi(rin , callback);
        dApi.requestApi();
    };
})();