(function () {

    var generateId = require('time-uuid/time');

    var coreWS = require('../WsCore/createWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    function DebitCred(debitCreditObj , callback , config , txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();

        var loanPayType = (debitCreditObj.loanPayType!=undefined &&
                            debitCreditObj.loanPayType!=null &&
                            String(debitCreditObj.loanPayType).trim().length>0)?("_"+String(debitCreditObj.loanPayType).toUpperCase()):"";

        var tranMode = config.transactionMode;
        var transCode = config.trancodes;
console.log("////////////////")
console.log(debitCreditObj)
console.log("////////////////")
        var debitTranCode = transCode[debitCreditObj.debitFrom.accountType+'_DEBIT'];
        var creditTranCode = transCode[debitCreditObj.creditTo.accountType+'_CREDIT'+loanPayType];

        if(debitCreditObj.creditTo.accountCategory == 'LOAN')
            tranMode = 'LEDGER'

        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME": "DebitOrCreditRq",
                "INSTANCE": {
                    "transactionInfos": [
                        {
                            "bankId": debitCreditObj.bankId,
                            "accountNo": debitCreditObj.debitFrom.accountNo,
                            "accountCategory": debitCreditObj.debitFrom.accountCategory,
                            "transactionAmount": debitCreditObj.debitFrom.transactionAmount,
                            "debitOrCredit": "DEBIT",
                            "description": debitCreditObj.debitRemarks,
                            // "description": debitCreditObj.description,
                            "transactionCode": debitTranCode,
                            "traceNumber": txnId,
                            "checkNo": null, //debitCreditObj.checkNo,
                            "transactionDate": {
                                "date": debitCreditObj.transactionDate
                            },
                            "transactionTime": {
                                "time": debitCreditObj.transactionTime
                            },
                            "remarks": debitCreditObj.debitRemarks,
                            // "remarks": debitCreditObj.remarks,
                            "transactionMode": 'MEMO_LEDGER'//tranMode
                        },
                        {
                            "bankId": debitCreditObj.bankId,
                            "accountNo": debitCreditObj.creditTo.accountNo,
                            "accountCategory": debitCreditObj.creditTo.accountCategory,
                            "transactionAmount": debitCreditObj.creditTo.transactionAmount,
                            "debitOrCredit": "CREDIT",
                            "description": debitCreditObj.creditRemarks,
                            // "description": debitCreditObj.description,
                            "transactionCode": creditTranCode,
                            "traceNumber": txnId,
                            "checkNo": null,//debitCreditObj.checkNo,
                            "transactionDate": {
                                "date": debitCreditObj.transactionDate
                            },
                            "transactionTime": {
                                "time": debitCreditObj.transactionTime
                            },
                            "remarks": debitCreditObj.creditRemarks,
                            // "remarks": debitCreditObj.remarks,
                            "transactionMode": tranMode
                        }
                    ],
                    "isForced": false,
                    "requestId": requestId,
                    "vfxRequestId": vfxRequestId
                }
            }
        };

        var validateResponse = function(error , response){

            if(error || response.status.statusCode != "00") {
                var errorObj = error || response;
                errorObj.status.statusCode = (typeof errorObj.status.statusCode == "undefined") ? '500' : errorObj.status.statusCode;
                errorObj = errorObj.status.statusDescription || errorCode;

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

    module.exports.DebitCredit = function(debitCreditObj , callback , config , txnId){
        return (new DebitCred(debitCreditObj , callback , config , txnId));
    };
})();