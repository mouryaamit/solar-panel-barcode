(function(){

    var wireMethod = require('../../../apiMethods/wireTransferMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var deleteWireTransferApi = function deleteWireTransferApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    deleteWireTransferApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var wirerTransfer = wireMethod(this.response.config , this.tnxId);
        wirerTransfer.deleteWireTransfer(this.response.request.body , resHandle);
    };

    module.exports.deleteWireTransferApi = function(rin , callback){
        var dApi = new deleteWireTransferApi(rin , callback);
        dApi.requestApi();
    };
})();