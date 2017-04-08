(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var userMethods = require('../apiMethods/userMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var adminCustomerInquiryApi = function adminCustomerInquiryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    adminCustomerInquiryApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = userMethods(this.response.config , resHandle , this.tnxId);
        customer.adminInquiryCustomer(this.response.request.body, resHandle);
    };

    module.exports.adminCustomerInquiryApi = function(rin , callback){

        var dApi = new adminCustomerInquiryApi(rin , callback);
        dApi.requestApi();
    };
})();