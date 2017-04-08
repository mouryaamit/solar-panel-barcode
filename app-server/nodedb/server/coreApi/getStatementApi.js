(function () {

    var path = require('path');

    var fs = require('fs');

    var coreWS = require('../WsCore/createWs');

    function StatementDownload(downloadObj, callback, config, txnId) {

        var validateResponse = function(error , response){
            var resObj = {
                filePath : ''
            };

            if(error) {
                resObj.filePath = 'statements/default.pdf';
                callback(null, resObj);
            }else{
                resObj.filePath = response;
                callback(null, resObj);
            }
        };

        var ws = coreWS({} , validateResponse);
        ws.getStatementFile(downloadObj.url , downloadObj.userId);
    }

    module.exports.StatementDownload = function(accountData , callback , config , txnId){
        return (new StatementDownload(accountData ,callback , config , txnId));
    };
})();