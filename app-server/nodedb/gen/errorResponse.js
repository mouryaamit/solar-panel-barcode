(function(){

    module.exports.ErrorMessage = function(config){

        var errorResponseEngine;
        try{
            errorResponseEngine = require('../templates/errorMessages/'+ config.emailTemplateFolder + '/'+ config.setLang +'/errorResponse');
        }catch(err){
            console.error('Cannot require the file at ../templates/errorMessages/'+ config.emailTemplateFolder + '/'+ config.setLang +'/errorResponse');
            errorResponseEngine = require('../templates/errorMessages/errorResponse');
        }
        return errorResponseEngine(config);
    };

})();