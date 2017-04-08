(function(){

    var transactionLimitMethod = require('../../apiMethods/transactionLimitsMethods');

    var debitCreditRequestApi = require('../coreApi/debitCreditRequestApi');

    var fundOneTimeFutureApi = require('../coreApi/fundOneTimeFutureApi');

    var fundRecurringTransferApi = require('../coreApi/fundRecurringTransferApi');

    var errorResponse = require('../../gen/errorResponse');

    function DebitCred(debitCreditData , config , tnxId){
        var dated = new Date();
        this.dated = (dated.getMonth() + 1) + "/" + dated.getDate() + "/" + dated.getFullYear().toString().substr(2,2);
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.bankId = this.config.instId;
        this.debitCreditData = debitCreditData;
        this.frequencyObj = {
            "Daily"             : "DAILY",
            "Weekly"            : "WEEKLY",
            "Bi-Weekly"         : "BI-WEEKLY",
            "Monthly"           : "MONTHLY",
            "Quarterly"         : "QUARTERLY",
            "Semi Annually"     : "SEMI_ANNUAL",
            "Annually"           : "ANNUALY"
        };
    }

    DebitCred.prototype = {
        coreCaller : function(callback){
            this.callback = callback;

            this.debitCreditData.frequency = (typeof this.frequencyObj[this.debitCreditData.frequency] == "undefined")?"":this.frequencyObj[this.debitCreditData.frequency];
            this.routed = {
                userId                  : this.debitCreditData.userId,
                transactionType         : 'Funds',
                transactionAmount       : this.debitCreditData.debitFrom.transactionAmount.amount
            };
            this.debitCreditData.bankId = this.bankId;
            var resHandle = this.processCoreResponse.bind(this);

            //if(this.debitCreditData.paySchedule == "Recurring"){
            //    fundRecurringTransferApi.DebitCreditRecurring(this.debitCreditData , resHandle , this.config  , this.tnxId);
            //}else{
            //    var transactionDate = new Date(this.debitCreditData.transactionDate);
            //    if(transactionDate > new Date(this.dated)){
            //       fundOneTimeFutureApi.OneTimeFuture(this.debitCreditData , resHandle , this.config  , this.tnxId);
            //    }else{
            debitCreditRequestApi.DebitCredit(this.debitCreditData , resHandle , this.config  , this.tnxId);
            //    }
            //}
        },
        editFundsTransfer: function(callback){
            this.callback = callback;

            this.debitCreditData.processType = "Edit";
            this.debitCreditData.frequency = (typeof this.frequencyObj[this.debitCreditData.frequency] == "undefined")?"":this.frequencyObj[this.debitCreditData.frequency];
            this.routed = {
                userId                  : this.debitCreditData.userId,
                transactionType         : 'Funds',
                transactionAmount       : this.debitCreditData.debitFrom.transactionAmount.amount
            };
            this.debitCreditData.bankId = this.bankId;
            var resHandle = this.processCoreResponse.bind(this);

            if(this.debitCreditData.paySchedule == "Recurring"){
                fundRecurringTransferApi.DebitCreditRecurring(this.debitCreditData , resHandle , this.config  , this.tnxId);
            }else{
                fundOneTimeFutureApi.OneTimeFuture(this.debitCreditData , resHandle , this.config  , this.tnxId);
            }
        },
        deleteFundsTransfer: function(callback){
            this.callback = callback;

            this.debitCreditData.processType = "Delete";
            this.debitCreditData.frequency = (typeof this.frequencyObj[this.debitCreditData.frequency] == "undefined")?"":this.frequencyObj[this.debitCreditData.frequency];
            this.debitCreditData.bankId = this.bankId;
            var resHandle = this.processDelete.bind(this);

            if(this.debitCreditData.paySchedule == "Recurring"){
                fundRecurringTransferApi.DebitCreditRecurring(this.debitCreditData , resHandle , this.config  , this.tnxId);
            }else{
                fundOneTimeFutureApi.OneTimeFuture(this.debitCreditData , resHandle , this.config  , this.tnxId);
            }
        },
        processDelete: function(error , response){
            if(error){
                //var errResponse = this.errorResponse[error];
                //this.callback(error , null);
                var errResponse = this.errorResponse["ZZ"];
                var errorCodeMsg = this.errorResponse[error.status.statusCode];
                errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "")?errorCodeMsg.responseData.message:error.status.statusDescription;
                this.callback(errResponse , null);
            }else{
                var res = {
                    message : 'Funds Transfer Deleted Successfully',
                    status: 200,
                    responseObj: response.INSTANCE
                };
                this.callback(null, res);
            }
        },
        processCoreResponse: function(error , response){
            if(error){
                //var errResponse = this.errorResponse[error];
                //this.callback(error , null);
                try {
                    var errResponse = this.errorResponse["ZZ"];
                    var errorCodeMsg = this.errorResponse[error.status.statusCode];
                    errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "") ? errorCodeMsg.responseData.message : error.status.statusDescription;
                    this.callback(errResponse, null);
                }
                catch(err){
                    this.callback(errResponse, null);
                }
            }else{
                //var response = sucess.INSTANCE.status;
                var transaction = transactionLimitMethod(this.config , this.tnxId);
                transaction.addDailyTransactionUpdate(this.routed);

                var res = {
                    message : 'Funds Transfer Request has been successfully sent for processing',
                    status: 200,
                    responseObj: response.INSTANCE
                };
                this.callback(null, res);
            }
        }
    };

    module.exports.DebitCredit = function(debitCreditData , config , tnxId){
        return (new DebitCred(debitCreditData , config , tnxId));
    };
})();
