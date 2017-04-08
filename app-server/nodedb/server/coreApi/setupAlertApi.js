(function () {

    var generateId = require('time-uuid/time');

    var coreWS = require('../WsCore/createWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    function AddAlert(alertObj , callback , config , txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();

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
            "When an ACH batch is removed by my financial institution"  : "ACH BATCH REMOVED"
        };

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
                    "parameters": {
                        "PARAM_1": amount,
                        "PARAM_2": null
                    },
                    "requestId": requestId,
                    "vfxRequestId": vfxRequestId
                }
            }
        };

        if(requestObj.requestBody.INSTANCE.alertType == 'ACH BATCH PROCESSED' || requestObj.requestBody.INSTANCE.alertType == 'ACH BATCH REMOVED'){
            requestObj.requestBody.INSTANCE.parameters.PARAM_1 = null;
            requestObj.requestBody.INSTANCE.parameters.PARAM_2 = null;
            requestObj.requestBody.INSTANCE.uniqueId = alertObj.customerId;
        }

        if(alertObj.alertMessage == 'When these check numbers are cleared'){
            requestObj.requestBody.INSTANCE.parameters.PARAM_1 = alertObj.accountInfo.checkNo.checkFrom;
            requestObj.requestBody.INSTANCE.parameters.PARAM_2 = alertObj.accountInfo.checkNo.checkTo;
        }

        /*if(alertObj.alertMessage == 'When these check numbers are cleared'){
            requestObj.requestBody.INSTANCE.parameters.PARAM_1 = alertObj.accountInfo.checkNo.checkFrom;
            requestObj.requestBody.INSTANCE.parameters.PARAM_2 = null;
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
                var validator = validate(schema.addAlert, resObj);
                callback(null, validator.validateCoreResponse());
            }
        };

        //console.log("Transaction ID : "+ txnId + " RequestSent : customerInformation TimeAt : " + startedAt);

        var ws = coreWS(requestObj , validateResponse);
        ws.requestCore();
    }

    module.exports.AddAlert = function(alertObj , callback , config , txnId){
        return (new AddAlert(alertObj , callback , config , txnId));
    };
})();