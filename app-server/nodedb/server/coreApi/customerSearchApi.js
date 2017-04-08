(function () {

    var generateId = require('time-uuid/time');

    var coreWS = require('../WsCore/createWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    function CustomerSearch(customerObj , callback , config , txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();

        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME"                  : "CustomerPowerSearchRq",
                "INSTANCE": {
                    "bankId"                    : config.instId,
                    "firstName"                 : customerObj.firstName,
                    "middleName"                : customerObj.middleName,
                    "lastName"                  : customerObj.lastName,
                    "customerId"                : customerObj.customerId,
                    "accountNo"                 : customerObj.accountNumber,
                    "requestId"                 : requestId,
                    "vfxRequestId"              : vfxRequestId,
                    "ignoreAccountInq"          : true
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
                var validator = validate(schema.customerSearch, resObj);
                callback(null, validator.validateCoreResponse());
            }
        };

        //console.log("Transaction ID : "+ txnId + " RequestSent : customerInformation TimeAt : " + startedAt);

        var ws = coreWS(requestObj , validateResponse);
        ws.requestCore();
    }

    module.exports.CustomerSearch = function(customerObj , callback , config , txnId){
        return (new CustomerSearch(customerObj , callback , config , txnId));
    };
})();