(function () {

    var generateId = require('time-uuid/time');

    var coreWS = require('../WsCore/createWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    function StatementDownload(accountData, callback, config, txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();

        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME": "StatementSearchRq",
                "INSTANCE": {
                    "institutionId": config.instId,
                    "accountNumber": accountData.accountNumber,
                    "fromDate": {
                        "date": accountData.fromDate
                    },
                    "toDate": {
                        "date": accountData.toDate
                    },
                    /*"institutionId": "1",
                    "accountNumber": "8744208795",
                    "fromDate": {
                        "date": "03/01/2015"
                    },
                    "toDate": {
                        "date": "03/31/2015"
                    },*/
                    "requestId":requestId,
                    "vfxRequestId":vfxRequestId
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
                var validator = validate(schema.statementSearch, resObj);
                callback(null, validator.validateCoreResponse());
            }
        };

        //console.log("Transaction ID : "+ txnId + " RequestSent : customerInformation TimeAt : " + startedAt);

        var ws = coreWS(requestObj , validateResponse);
        ws.requestCore();
    }

    module.exports.StatementDownload = function(accountData , callback , config , txnId){
        return (new StatementDownload(accountData ,callback , config , txnId));
    };
})();