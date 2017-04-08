(function () {

    var moment = require('moment');

    var generateId = require('time-uuid/time');

    var coreWS = require('../WsCore/createWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    function OneTimeFuture(debitCreditObj , callback , config , txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();

        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME": "OneTimeInstructionRq",
                "INSTANCE": {
                    "sourceBankId": debitCreditObj.bankId,
                    "sourceAccountNo": debitCreditObj.debitFrom.accountNo,
                    "targetBankId": debitCreditObj.bankId,
                    "targetAccountNo": debitCreditObj.creditTo.accountNo,
                    "transferAmount": debitCreditObj.debitFrom.transactionAmount.amount,
                    "transferDate": {
                        "date": debitCreditObj.transactionDate
                    },
                    "remarks":debitCreditObj.remarks,
                    "requestId": requestId,
                    "vfxRequestId": vfxRequestId
                }
            }
        };

        if(debitCreditObj.processType == "Edit") requestObj.requestBody.INSTANCE["instructionId"] = debitCreditObj.instructionId;

        if(debitCreditObj.processType == "Delete"){
            requestObj.requestBody.INSTANCE["instructionId"] = debitCreditObj.instructionId;
            requestObj.requestBody.INSTANCE["isActive"] = false;
        }

        var validateResponse = function(error , response){
            if(error || response.status.statusCode != "00") {
                var errorObj = error || response;
                errorObj.status.statusCode = (typeof errorObj.status.statusCode == "undefined")?'500':errorObj.status.statusCode;
                //errorObj = errorObj.status.statusDescription || errorCode;
                callback(errorObj, null);
            }else{
                var resObj = response.responses[requestId];
                var validator = validate(schema.debitOrCredit, resObj);
                callback(null, validator.validateCoreResponse());
            }
        };

        //console.log("Transaction ID : "+ txnId + " RequestSent : customerInformation TimeAt : " + startedAt);

        var ws = coreWS(requestObj , validateResponse);
        ws.requestCore();
    }

    module.exports.OneTimeFuture = function(debitCreditObj , callback , config , txnId){
        return (new OneTimeFuture(debitCreditObj , callback , config , txnId));
    };
})();