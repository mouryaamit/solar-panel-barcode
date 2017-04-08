/**
 * Created by amourya on 7/17/16.
 */
(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var generateCaptchaApi = function generateCaptchaApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    generateCaptchaApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethod(this.response.config , resHandle , this.tnxId);
        customer.generateCaptcha(resHandle);
    };

    module.exports.generateCaptchaApi = function(rin , callback){

        var dApi = new generateCaptchaApi(rin , callback);
        dApi.requestApi();
    };
})();