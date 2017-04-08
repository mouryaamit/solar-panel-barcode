(function () {

    var generateId = require('time-uuid/time');

    var coreWS = require('../WsACH/createWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    function AddAchInst(instructionData , callback , config , txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();

        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME":"AddAchInstructionRq",
                "INSTANCE":{
                    "instructionDatas": instructionData.instructions,
                    "customerId":instructionData.customerId, //customerId
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
                var validator = validate(schema.achInstruction, resObj);
                callback(null, validator.validateCoreResponse());
            }
        };

        //console.log("Transaction ID : "+ txnId + " RequestSent : customerInformation TimeAt : " + startedAt);

        var ws = coreWS(requestObj , validateResponse);
        ws.requestCore();
    }

    module.exports.AddAchInstruction = function(instructionData , callback , config , txnId){
        return (new AddAchInst(instructionData ,callback , config , txnId));
    };
})();