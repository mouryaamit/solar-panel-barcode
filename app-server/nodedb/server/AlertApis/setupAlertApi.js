(function () {

    var generateId = require('time-uuid/time');

    var alertWS = require('../WsAlerts/vsoftAlertWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    var utils = require('../../lib/utils/utils');

    function AddAlert(alertObj , callback , config , txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();
        this.utils = utils.util();
        var alertTo = '';
        if(alertObj.alertThroughEmail) alertTo = 'ALERT TO EMAIL';
        if(alertObj.alertThroughPhone) alertTo = 'ALERT TO MOBILE';
        if(alertObj.alertThroughEmail && alertObj.alertThroughPhone) alertTo = 'ALERT TO BOTH';

        var accountInfo = alertObj.accountInfo || {};
        var accountNumber = "", amount = "";

        if(accountInfo.accountNo) accountNumber = alertObj.accountInfo.accountNo || null;
        if(accountInfo.amount) amount = alertObj.accountInfo.amount || null;

        var alertType = {
            "When my balance is greater than"                           : "BALANCE GREATER THAN",
            "When my balance is less than"                              : "BALANCE LESS THAN",
            "For all withdrawal amounts greater than"                   : "WITHDRAWL GREATER THAN",
            "For all deposit amounts greater than"                      : "DEPOSIT GREATER THAN",
            "When these check numbers are cleared"                      : "CHECK NUMBER CLEARING",
            "To re-order checks when this check number has cleared"     : "CHECK REORDERING",
            "When transfer occurs to/from my account"                   : "ACCOUNT TRANSFER",
            "When a recurring transfer was not processed"               : "UNPROCESSED RECURRING TRANSFER",
            "When my statement is available"                            : "STATEMENT AVAILABILITY",
            "When an ACH batch is processed by my financial institution": "ACH BATCH PROCESSED",
            "When an ACH batch is removed by my financial institution"  : "ACH BATCH REMOVED",
            "When my login has been reset"                              : "LOGIN RESET",
            "When my login attempts exceed the limit"                   : "USER LOCKED",
            "When a wire transfer is submitted for processing"			: "WIRE TRANSFER PROCESSING"
        };

        console.log('from set up alert API');

        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME": "AlertSetupRq",
                "INSTANCE": {
                    "bankId": alertObj.bankId,
                    "customerId": alertObj.customerId,
                    "accountNo": accountNumber,
                    "alertType": alertType[alertObj.alertMessage] || '',
                    "dndFrom": alertObj.alertTime.alertFrom,
                    "dndTo": alertObj.alertTime.alertTo,
                    "alertTo": alertTo,
                    "param1": amount,
                    "param2": null,
                    "userId":alertObj.userId,
                    "requestId": requestId,
                    "vfxRequestId": vfxRequestId
                }
            }
        };

        if(this.utils.isSubUser(alertObj.createdBy,alertObj.originator)){
            requestObj.requestBody.INSTANCE.emailAddress = alertObj.emailId;
            requestObj.requestBody.INSTANCE.phoneNo = alertObj.phoneNo;
        }

        if(requestObj.requestBody.INSTANCE.alertType == 'USER LOCKED' || requestObj.requestBody.INSTANCE.alertType == 'LOGIN RESET') {
            requestObj.requestBody.INSTANCE.uniqueId = alertObj.customerId;
            requestObj.requestBody.INSTANCE.param1 = null;
            requestObj.requestBody.INSTANCE.param2 = null;
        }

        if(requestObj.requestBody.INSTANCE.alertType == 'ACH BATCH PROCESSED' || requestObj.requestBody.INSTANCE.alertType == 'ACH BATCH REMOVED'){
            requestObj.requestBody.INSTANCE.param1 = null;
            requestObj.requestBody.INSTANCE.param2 = null;
            requestObj.requestBody.INSTANCE.uniqueId = alertObj.customerId;
        }

        if(alertObj.alertMessage == 'When these check numbers are cleared' || alertObj.alertMessage == "To re-order checks when this check number has cleared"){
            requestObj.requestBody.INSTANCE.param1 = alertObj.accountInfo.checkNo.checkFrom;
            requestObj.requestBody.INSTANCE.param2 = alertObj.accountInfo.checkNo.checkTo;
        }

        /*if(alertObj.alertMessage == 'When these check numbers are cleared'){
         requestObj.requestBody.INSTANCE.param1 = alertObj.accountInfo.checkNo.checkFrom;
         requestObj.requestBody.INSTANCE.param2 = null;
         }*/

        if(alertObj.alertEdit) requestObj.requestBody.INSTANCE.alertId = alertObj.alertCoreId;

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

        console.log('calling alertws file.....');
        var ws = alertWS(requestObj , validateResponse);
        ws.requestVsoftAlertServer();
    }

    module.exports.AddAlert = function(alertObj , callback , config , txnId){
        return (new AddAlert(alertObj , callback , config , txnId));
    };
})();