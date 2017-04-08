(function(){

    var checkImagesApi = require('../coreApi/checkImagesApi');

    var errorResponse = require('../../gen/errorResponse');

    function CheckImages(checkData , config , tnxId){
        this.tnxId = tnxId;
        this.bankId = config.instId;
        this.checkData = checkData;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
    }

    CheckImages.prototype = {
        coreCaller : function(callback){
            this.callback = callback;
            this.checkData.institutionId = this.bankId;
            this.checkData.bankId = this.bankId;

            var resHandle = this.processCoreResponse.bind(this);
            checkImagesApi.CheckImages(this.checkData , resHandle , this.config , this.tnxId);
        },
        processCoreResponse: function(error , response){
            if(error){
                //var errResponse = this.errorResponse[error];
                //this.callback(error , null);
                var errResponse = this.errorResponse["ZZ"];
                var errorCodeMsg = this.errorResponse[error.status.statusCode];
                errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "")?errorCodeMsg.responseData.message:error.status.statusDescription;
                this.callback(errResponse , null);
            }else{
                this.callback(null , response.INSTANCE);
            }
        }
    };

    module.exports.CheckImages = function(checkData , config , tnxId){
        return (new CheckImages(checkData , config , tnxId));
    };
})();
