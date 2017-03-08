(function(){

    module.exports.ErrorMessage = function(config){

        var errorResponseEngine;
        try{
            errorResponseEngine = require('../templates/errorMessages/'+ config.emailTemplateFolder + '/'+ config.setLang +'/errorResponse');
        }catch(err){
            console.log('Cannot require the file at ../templates/errorMessages/'+ config.emailTemplateFolder + '/'+ config.setLang +'/errorResponse');
            errorResponseEngine = require('../templates/errorMessages/errorResponse');
        }
        return errorResponseEngine(config);
    };

})();