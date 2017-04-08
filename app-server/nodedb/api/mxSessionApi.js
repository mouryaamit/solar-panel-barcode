(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var mxSessionApi = function mxSessionApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    mxSessionApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethod(this.response.config , resHandle , this.tnxId);
        customer.mx(this.response.request.body);
    };

    module.exports.mxSessionApi = function(rin , callback){

        var dApi = new mxSessionApi(rin , callback);
        dApi.requestApi();
    };
})();