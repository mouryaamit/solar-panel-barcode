(function(){

    module.exports = function(config){

        var successResponseEngine;
        try{
            successResponseEngine = require('../templates/successMessages/'+ config.emailTemplateFolder + '/'+ config.setLang +'/successResponse');
        }catch(err){
            console.error('Cannot require the file at ../templates/successMessages/'+ config.emailTemplateFolder + '/'+ config.setLang +'/successResponse');
            successResponseEngine = require('../templates/successMessages/successResponse');
        }
        return successResponseEngine(config);
    };
})();