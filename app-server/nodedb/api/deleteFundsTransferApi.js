(function(){

    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var deleteFundsTransferApi = function deleteFundsTransferApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    deleteFundsTransferApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethod(this.response.config , resHandle , this.tnxId);
        customer.deleteFundsTransfer(this.response.request.body);
    };

    module.exports.deleteFundsTransferApi = function(rin , callback){
        var dApi = new deleteFundsTransferApi(rin , callback);
        dApi.requestApi();
    };
})();