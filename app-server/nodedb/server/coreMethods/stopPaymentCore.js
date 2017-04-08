(function(){

    //var transactionLimitMethod = require('../../apiMethods/transactionLimitsMethods');

    var stopPaymentCheckApi = require('../coreApi/stopPaymentApi');

    var deleteStopPaymentApi = require('../coreApi/deleteStopPaymentApi');

    var stopPaymentCheckListApi = require('../coreApi/stopPaymentCheckListApi');

    var stopPaymentACHApi = require('../coreApi/stopPaymentACHApi');

    var errorResponse = require('../../gen/errorResponse');

    function StopPayment(paymentData , config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.bankId = config.instId;
        this.paymentData = paymentData;
    }

    StopPayment.prototype = {
        coreCaller : function(callback){
            this.callback = callback;

            this.paymentData.bankId = this.bankId;
            var resHandle = this.processCoreResponse.bind(this);

            if(this.paymentData.paymentType == "Check"){
                stopPaymentCheckApi.StopPaymentCheck(this.paymentData , resHandle , this.config , this.tnxId);
            }else{
                stopPaymentACHApi.StopPaymentACH(this.paymentData , resHandle , this.config , this.tnxId);
            }
        },
        processCoreResponse: function(error , response){
            if(error){
                //var errResponse = this.errorResponse[error];
                //this.callback(error , null);
                var errResponse = this.errorResponse["ZZ"];
                var errorCodeMsg = this.errorResponse[error.status.statusCode];
                errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "")?errorCodeMsg.responseData.message:error.status.statusDescription;
                errResponse.responseData.overrideStatus = error.status.overrideStatus;
                this.callback(errResponse , null);
            }else{
                //var response = sucess.INSTANCE.status;
                var res = {
                    message : 'Stop Check is Complete',
                    status: 200,
                    responseObj: response.INSTANCE
                };
                this.callback(null, res);
            }
        },
        deleteCoreCaller : function(callback){
            this.callback = callback;

            this.paymentData.bankId = this.bankId;
            var resHandle = this.processCoreDeleteResponse.bind(this);
            // if(this.paymentData.paymentType == "Check"){//TODO CHECK ACH
                deleteStopPaymentApi.StopPaymentDeleteCheck(this.paymentData , resHandle , this.config , this.tnxId);
            // }
        },
        processCoreDeleteResponse: function(error , response){
            if(error){
                //var errResponse = this.errorResponse[error];
                //this.callback(error , null);
                var errResponse = this.errorResponse["ZZ"];
                var errorCodeMsg = this.errorResponse[error.status.statusCode];
                errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "")?errorCodeMsg.responseData.message:error.status.statusDescription;
                errResponse.responseData.overrideStatus = error.status.overrideStatus;
                this.callback(errResponse , null);
            }else{
                //var response = sucess.INSTANCE.status;
                var res = {
                    message : 'Stop Payment is Deleted Successfully',
                    status: 200,
                    responseObj: response.INSTANCE
                };
                this.callback(null, res);
            }
        },
        getCheckList : function(callback){
            this.callback = callback;

            this.paymentData.bankId = this.bankId;
            var resHandle = this.processCoreResponseForCheckList.bind(this);
            stopPaymentCheckListApi.StopPaymentCheckList(this.paymentData , resHandle , this.config , this.tnxId);
        },
        processCoreResponseForCheckList: function(error , response){
            if(error){
                //var errResponse = this.errorResponse[error];
                //this.callback(error , null);
                var errResponse = this.errorResponse["ZZ"];
                var errorCodeMsg = this.errorResponse[error.status.statusCode];
                errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "")?errorCodeMsg.responseData.message:error.status.statusDescription;
                this.callback(errResponse , null);
            }else{
                this.callback(null, response);
            }
        }
    };

    module.exports.StopPayment = function(paymentData , config , tnxId){
        return (new StopPayment(paymentData , config , tnxId));
    };
})();
