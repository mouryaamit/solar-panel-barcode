(function () {

    var moment = require('moment');

    var generateId = require('time-uuid/time');

    var coreWS = require('../WsCore/createWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    function DebitCredRecurring(debitCreditObj , callback , config , txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();

        var dated = new Date();
        //var transactionFrequency = new Date(debitCreditObj.transactionDate);

        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME": "RecurringInstructionRq",
                "INSTANCE": {
                    "sourceBankId": debitCreditObj.bankId,
                    "sourceAccountNo": debitCreditObj.debitFrom.accountNo,
                    "targetBankId": debitCreditObj.bankId,
                    "targetAccountNo": debitCreditObj.creditTo.accountNo,
                    "transferAmount": debitCreditObj.debitFrom.transactionAmount.amount,
                    "numberOfTransfers": 0,
                    "automaticTransfer": false,
                    "allowOverdraft": false,
                    "transferFrequency": debitCreditObj.frequency,//"0" + moment(transactionFrequency).format('DD'),
                    "instructionStatus": 0,
                    "instructionDate": {
                        "date": moment(dated).format('MM/DD/YYYY')
                    },
                    "startDate": {
                        "date": debitCreditObj.transactionDate
                    },
                    "endDate": {
                        "date": debitCreditObj.expirationDate
                    },
                    "remarks":debitCreditObj.remarks,
                    "processOn": "Build_Sat_Sun_on_Monday",
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

    module.exports.DebitCreditRecurring = function(debitCreditObj , callback , config , txnId){
        return (new DebitCredRecurring(debitCreditObj , callback , config , txnId));
    };
})();