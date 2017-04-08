(function(){

    var pendingTransferApi = require('../coreApi/pendingTransferApi');

    var errorResponse = require('../../gen/errorResponse');

    function PendingTransfer(customerData , config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.bankId = config.instId;
        this.customerData = customerData;
    }

    PendingTransfer.prototype = {
        coreCaller : function(callback){
            this.callback = callback;

            this.customerData.bankId = this.bankId;
            this.customerData.customerId = this.customerData.customersId;
            var resHandle = this.processCoreResponse.bind(this);
            pendingTransferApi.PendingTransfer(this.customerData , resHandle , this.config , this.tnxId);
        },
        processCoreResponse: function(error , response){
            if(error){
                //var errResponse = this.errorResponse[error];
                //this.callback(error , null);
                var errResponse = this.errorResponse["ZZ"];
                var errorCodeMsg = this.errorResponse[error.status.statusCode];
                errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "")?errorCodeMsg.responseData.message:error.status.statusDescription;
                this.callback(errResponse , null);
            }else{
                this.callback(null , response.INSTANCE);
            }
        }
    };

    module.exports.PendingTransfer = function(customerData , config , tnxId){
        return (new PendingTransfer(customerData , config , tnxId));
    };
})();
