(function(){

    var wireMethod = require('../../../apiMethods/wireTransferMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var listWireTransferApi = function listWireTransferApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listWireTransferApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var wirerTransfer = wireMethod(this.response.config , this.tnxId);
        wirerTransfer.listWireTransfers(this.response.request.body , resHandle);
    };

    module.exports.listWireTransferApi = function(rin , callback){
        var dApi = new listWireTransferApi(rin , callback);
        dApi.requestApi();
    };
})();