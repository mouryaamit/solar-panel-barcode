(function(){

    var paperwork = require('../lib/utils/paperwork');

    var validateCoreResponse = function validateCoreResponse(schema , coreResponse){
        this.schema = schema;
        this.coreResponse = coreResponse
    };

    validateCoreResponse.prototype = {
        validateCoreResponse : function(){
            return paperwork(this.schema , this.coreResponse);
        }
    };

    module.exports = function(schema , coreResponse){
        return (new validateCoreResponse(schema , coreResponse));
    };
})();