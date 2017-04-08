(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var userMethod = require('../apiMethods/userMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var customerInquiryApi = function customerInquiryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    customerInquiryApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.inquiryCustomer(this.response.request.body,resHandle);
    };

    module.exports.customerInquiryApi = function(rin , callback){

        var dApi = new customerInquiryApi(rin , callback);
        dApi.requestApi();
    };
})();