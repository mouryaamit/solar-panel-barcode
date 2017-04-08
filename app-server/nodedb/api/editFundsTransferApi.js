(function(){

    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var editFundsTransferApi = function editFundsTransferApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    editFundsTransferApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethod(this.response.config , resHandle , this.tnxId);
        customer.editFundsTransfer(this.response.request.body);
    };

    module.exports.editFundsTransferApi = function(rin , callback){
        var dApi = new editFundsTransferApi(rin , callback);
        dApi.requestApi();
    };
})();