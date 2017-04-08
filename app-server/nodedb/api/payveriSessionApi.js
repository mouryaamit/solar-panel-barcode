(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var payverisSessionApi = function payverisSessionApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    payverisSessionApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethod(this.response.config , resHandle , this.tnxId);
        customer.payveris(this.response.request.body);
    };

    module.exports.payverisSessionApi = function(rin , callback){

        var dApi = new payverisSessionApi(rin , callback);
        dApi.requestApi();
    };
})();