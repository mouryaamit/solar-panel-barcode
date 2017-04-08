(function(){

    var transactionInquiryApi = require('../coreApi/transactionInquiryApi');

    //var coreErrorResponse = require('../../gen/coreResponseTemplate');
    var schema = require('../../gen/coreResponseSchema');

    var paperwork = require('../../lib/utils/paperwork');

    var errorResponse = require('../../gen/errorResponse');

    function TransactionInq(transactionObj , config , tnxId){
        this.tnxId = tnxId;
        this.bankId = config.instId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.transactionObj = transactionObj;//"040404565323";
        /*this.accountNo = transactionObj.accountNo;//"040404565323";
         this.fromDate = transactionObj.fromDate;//"01/01/2014";
         this.toDate = transactionObj.toDate;//"01/05/2015";*/
        this.sortingOrder = "desc";
        // this.errorResponse = errorResponse.ErrorMessage();
    }

    TransactionInq.prototype = {
        coreCaller : function(callback) {
            this.callback = callback;
            this.transactionObj.bankId = this.bankId;
            this.transactionObj.sortingOrder = this.sortingOrder;

            var queryAmount = this.validateOptionalQueryAmount(this.transactionObj);
            var queryCheque = this.validateOptionalQueryCheque(this.transactionObj);
            var queryDate = this.validateOptionalQueryDate(this.transactionObj);

//            if (queryAmount && queryCheque && queryDate) {
            if (queryDate) {
                var resHandle = this.processCoreResponse.bind(this);
                transactionInquiryApi.TransactionInquiry(this.transactionObj, resHandle, this.config , this.tnxId);
            }else{
                var errResponse = this.errorResponse.InCorrectRequestError;
                this.callback(errResponse , null);
            }
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
        },
        validateOptionalQueryAmount: function(body){
            if(body.queryAmount) {
                return (paperwork.accepted(schema.optionalFields.queryAmount, body.queryAmount));
            }else{
                return true;
            }
        },
        validateOptionalQueryCheque: function(body){
            if(body.queryCheque) {
                return (paperwork.accepted(schema.optionalFields.queryCheque, body.queryCheque));
            }else{
                return true;
            }
        },
        validateOptionalQueryDate: function(body){
            if(body.queryDate) {
                return (paperwork.accepted(schema.optionalFields.queryDate, body.queryDate));
            }else{
                return true;
            }
        }
    };

    module.exports.TransactionInquiry = function(transactionObj , config , tnxId){
        return (new TransactionInq(transactionObj , config , tnxId));
    };
})();
