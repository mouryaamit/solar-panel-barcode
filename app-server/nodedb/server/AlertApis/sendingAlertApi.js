(function () {

    var generateId = require('time-uuid/time');

    var alertWS = require('../WsAlerts/vsoftAlertWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    var utils = require('../../lib/utils/utils');

    function SendingAlert(alertObj , callback , config , txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();
        this.utils = utils.util();
        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME": "AlertRq",
                "INSTANCE": {
                    "bankId":config.instId,
                    "alertType": "OTHER",
                    "message": alertObj.emailMessage,
                    "requestId": requestId,
                    "vfxRequestId": vfxRequestId,
                    "customerId":alertObj.customerId,
                    "emailInd":alertObj.emailInd,
                    "smsInd":alertObj.smsInd,
                    "userId":alertObj.userId,
                    "subject": alertObj.subject
                }
            }
        };

        if(this.utils.isSubUser(alertObj.createdBy,alertObj.originator)){
            requestObj.requestBody.INSTANCE.emailAddress = alertObj.emailId;
            requestObj.requestBody.INSTANCE.phoneNo = alertObj.phoneNo;
        }

        var validateResponse = function(error , response){};

        //console.log("Transaction ID : "+ txnId + " RequestSent : customerInformation TimeAt : " + startedAt);

        var ws = alertWS(requestObj , validateResponse);
        ws.requestVsoftAlertServer();
    }

    module.exports.SendingAlert = function(alertObj , callback , config , txnId){
        return (new SendingAlert(alertObj , callback , config , txnId));
    };
})();