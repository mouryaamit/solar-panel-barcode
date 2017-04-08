/**
 * Created by amitmourya on 29/08/16.
 */
(function(){

    var checkCaputeMethod = require('../../apiMethods/checkCaputerMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var api = function accountInquiryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.queryparam = rin.request.params;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    api.prototype.requestApi = function(){
        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var checkCapute = checkCaputeMethod(this.response.config , this.tnxId);
        checkCapute.transmit(this.body,resHandle);
    };

    module.exports.api = function(rin , callback){

        var dApi = new api(rin , callback);
        dApi.requestApi();
    };
})();