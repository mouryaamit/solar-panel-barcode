(function () {

    var generateId = require('time-uuid/time');

    var coreWS = require('../WsCore/createWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    function StopPayment(paymentObj , callback , config , txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();

        var fromAmount = paymentObj.checkInfo.amount.amountFrom;
        if(fromAmount=="")
            fromAmount = null;

        var toAmount = paymentObj.checkInfo.amount.amountTo;
        if(toAmount=="")
            toAmount = null;

        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME": "StopCheckPaymentRq",
                "INSTANCE": {
                    "bankId": paymentObj.bankId,
                    "issueMode": "WRITTEN",
                    "customerId": paymentObj.customerId,
                    "lowCheckNumber": paymentObj.checkInfo.checkNumber.checkNoFrom,
                    "highCheckNumber": paymentObj.checkInfo.checkNumber.checkNoTo,
                    "lowAmount": fromAmount,
                    "highAmount": toAmount,
                    "stopStatus": "ACTIVE_STOP",
                    "accountNo": paymentObj.accountNo,
                    "comments": paymentObj.comments,
                    "payee": paymentObj.payee,
                    "reason": paymentObj.reason,
                    "expirationDate":paymentObj.expirationDate,
                    "isOverride":paymentObj.isOverride,
                    "requestId": requestId,
                    "vfxRequestId": vfxRequestId
                }
            }
        };

        var validateResponse = function(error , response){
            if(error || response.status.statusCode != "00") {
                var errorObj = error || response;
                errorObj.status.statusCode = (typeof errorObj.status.statusCode == "undefined")?'500':errorObj.status.statusCode;
                //errorObj = errorObj.status.statusDescription || errorCode;
                callback(errorObj, null);
            }else{
                var resObj = response.responses[requestId];
                var validator = validate(schema.stopPayment, resObj);
                callback(null, validator.validateCoreResponse());
            }
        };

        //console.log("Transaction ID : "+ txnId + " RequestSent : customerInformation TimeAt : " + startedAt);

        var ws = coreWS(requestObj , validateResponse);
        ws.requestCore();
    }

    module.exports.StopPaymentCheck = function(paymentObj , callback , config , txnId){
        return (new StopPayment(paymentObj , callback , config , txnId));
    };
})();