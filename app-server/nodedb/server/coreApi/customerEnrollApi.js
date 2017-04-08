(function () {

    var generateId = require('time-uuid/time');

    var coreWS = require('../WsCore/createWs');

    /*var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');*/

    function CustomerEnrollment(customerObj , callback , config , txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();

        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME"  : "CustomerEnrollmentRq",
                "INSTANCE": {
                    "bankId": customerObj.bankId,
                    "enrollmentDate": {
                        "date": customerObj.dated
                    },
                    "requestId"                 : requestId,
                    "vfxRequestId"              : vfxRequestId
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
                //var validator = validate(schema.accountInquiry, resObj);
                //callback(null, validator.validateCoreResponse());
                callback(null, resObj);
            }
        };

        //console.log("Transaction ID : "+ txnId + " RequestSent : customerInformation TimeAt : " + startedAt);

        var ws = coreWS(requestObj , validateResponse);
        ws.requestCore();
    }

    module.exports.CustomerEnrollment = function(accountObj , callback , config , txnId){
        return (new CustomerEnrollment(accountObj , callback , config , txnId));
    };

})();