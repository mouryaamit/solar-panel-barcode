(function () {

    var generateId = require('time-uuid/time');

    var coreWS = require('../WsCore/createWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    function TransactionInq(transactionObj , callback, config, txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();

        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME": "AccountTransactionsInqRq",
                "INSTANCE": {
                    "bankId": transactionObj.bankId,
                    "accountNumber": transactionObj.accountNo,//"040404565323",
                    "sortingOrder": transactionObj.sortingOrder,//"desc",
                    "sourceName" : transactionObj.source,
                    "dcFlag" : transactionObj.transactionType,
                    "requestId": requestId,
                    "vfxRequestId": vfxRequestId
                }
            }
        };

        if(transactionObj.queryAmount){
            requestObj.requestBody.INSTANCE.fromAmount = transactionObj.queryAmount.fromAmount;
            requestObj.requestBody.INSTANCE.toAmount = transactionObj.queryAmount.toAmount;
        }

        if(transactionObj.queryDate){
            requestObj.requestBody.INSTANCE.fromDate = transactionObj.queryDate.fromDate;
            requestObj.requestBody.INSTANCE.toDate = transactionObj.queryDate.toDate;
        }

        if(transactionObj.queryCheque){
            requestObj.requestBody.INSTANCE.chequeNoFrom = transactionObj.queryCheque.chequeNoFrom;
            requestObj.requestBody.INSTANCE.chequeNoTo = transactionObj.queryCheque.chequeNoTo;
        }

        var validateResponse = function(error , response){
            if(error || response.status.statusCode != "00") {
                var errorObj = error || response;
                errorObj.status.statusCode = (typeof errorObj.status.statusCode == "undefined")?'500':errorObj.status.statusCode;
                //errorObj = errorObj.status.statusDescription || errorCode;
                callback(errorObj, null);
            }else{
                var resObj = response.responses[requestId];
                for(var i = 0 ; i < resObj.INSTANCE.transactionsData.length ; i++) {
                    if(resObj.INSTANCE.transactionsData[i].showPostedDate == null || resObj.INSTANCE.transactionsData[i].showPostedDate == undefined){
                        resObj.INSTANCE.transactionsData[i].showPostedDate = true;
                    }
                }
                var validator = validate(schema.transactionInquiry, resObj);
                callback(null, validator.validateCoreResponse());
            }
        };

        //console.log("Transaction ID : "+ txnId + " RequestSent : customerInformation TimeAt : " + startedAt);
        var ws = coreWS(requestObj , validateResponse);
        ws.requestCore();
    }

    module.exports.TransactionInquiry = function(transactionObj , callback, config, txnId){
        return (new TransactionInq(transactionObj , callback, config, txnId));
    }

})();