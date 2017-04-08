(function () {

    var generateId = require('time-uuid/time');

    var coreWS = require('../WsCore/createWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    function CustomerInq(customerObj , callback , config , txnId, excludedAccounts) {
        var vfxRequestId = generateId();
        var requestId = generateId();
        var excludeAccounts = null || [];
        for(var i = 0 ; i < excludedAccounts.length ; i++){
            excludeAccounts.push(excludedAccounts[i].accountNo)
        }
        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME"                  : "CustomerInqRq",
                "INSTANCE": {
                    "bankId"                    : customerObj.bankId,
                    "customerId"                : customerObj.customerId,
                    "ignoreAccountInq"          : customerObj.ignoreAccountInq,
                    "requestId"                 : requestId,
                    "vfxRequestId"              : vfxRequestId,
                    "excludeAccounts"           : excludeAccounts //excludedAccounts
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
                var validator = validate(schema.customerInquiry, resObj);
                callback(null, validator.validateCoreResponse());
            }
        };

        //console.log("Transaction ID : "+ txnId + " RequestSent : customerInformation TimeAt : " + startedAt);

        var ws = coreWS(requestObj , validateResponse);
        ws.requestCore();
    }

    module.exports.CustomerInquiry = function(customerObj , callback , config , txnId, excludedAccounts){
        return (new CustomerInq(customerObj , callback , config , txnId, excludedAccounts));
    };
})();