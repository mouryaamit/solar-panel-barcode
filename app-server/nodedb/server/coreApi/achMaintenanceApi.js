(function () {

    var generateId = require('time-uuid/time');

    var coreWS = require('../WsACH/createWs');

    var schema = require('../../gen/coreResponseSchema');

    var validate = require('../../gen/coreResponseValidate');

    function MaintenanceAchInst(instructionData , callback , config , txnId) {
        var vfxRequestId = generateId();
        var requestId = generateId();

        var requestObj = {
            config : config,
            requestId: requestId,
            vfxRequestId: vfxRequestId,
            requestBody: {
                "REQUEST_NAME":"InstructionMaintenaceRq",
                "INSTANCE":{
                    "instructionSearchRequest":instructionData.isSearch,
                    "requestId":requestId,
                    "vfxRequestId":vfxRequestId
                }
            }
        };

        var schemaValid = schema.achSearchInstruction;
        if(instructionData.isSearch){
            requestObj.requestBody.INSTANCE.instructionId = instructionData.instructionId;
            if(instructionData.batchId) requestObj.requestBody.INSTANCE.channelBatchId = instructionData.batchId;
            schemaValid = schema.achSearchInstruction;
            //requestObj.requestBody.INSTANCE.channelBatchId = "10010112";
        }
        requestObj.requestBody.INSTANCE.deletedInstructions = instructionData.deletedInstructions;
        requestObj.requestBody.INSTANCE.modifiedInstructions = instructionData.modifiedInstructions;

        var validateResponse = function(error , response){
            if(error || response.status.statusCode != "00") {
                var errorObj = error || response;
                errorObj.status.statusCode = (typeof errorObj.status.statusCode == "undefined")?'500':errorObj.status.statusCode;
                //errorObj = errorObj.status.statusDescription || errorCode;
                callback(errorObj, null);
            }else{
                var resObj = response.responses[requestId];
                var validator = validate(schemaValid, resObj);
                callback(null, validator.validateCoreResponse());
            }
        };

        //console.log("Transaction ID : "+ txnId + " RequestSent : customerInformation TimeAt : " + startedAt);

        var ws = coreWS(requestObj , validateResponse);
        ws.requestCore();
    }

    module.exports.MaintenanceAchInst = function(instructionData , callback , config , txnId){
        return (new MaintenanceAchInst(instructionData ,callback , config , txnId));
    };
})();