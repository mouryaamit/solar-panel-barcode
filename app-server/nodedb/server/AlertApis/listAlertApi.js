(function () {

    var generateId = require('time-uuid/time');

    var alertWS = require('../WsAlerts/vsoftAlertWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    function ListAlert(alertObj , callback , config , txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();

        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME": "AlertListRq",
                "INSTANCE": {
                    "bankId"		 : alertObj.bankId,
                    "customerId"	 : alertObj.customerId,
                    "emailAddress": alertObj.emailAddress,
                    "userId":alertObj.userId,
                    "requestId"   : requestId,
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
                //var validator = validate(schema.accountInquiry, resObj);
                //callback(null, validator.validateCoreResponse());
                callback(null, resObj);
            }
        };

        //console.log("Transaction ID : "+ txnId + " RequestSent : customerInformation TimeAt : " + startedAt);

        var ws = alertWS(requestObj , validateResponse);
        ws.requestVsoftAlertServer();
    }

    module.exports.ListAlert = function(alertObj , callback , config , txnId){
        return (new ListAlert(alertObj , callback , config , txnId));
    };
})();