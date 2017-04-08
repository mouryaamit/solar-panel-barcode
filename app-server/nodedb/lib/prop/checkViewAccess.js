(function(){

    var _ = require('underscore');

    var errorResponse = require('../../gen/errorResponse');

    var viewAccess = function(viewType, accessObj, config){
        this.viewType = viewType || '';
        this.accessObj = accessObj;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
    };

    viewAccess.prototype = {
        checkViewAccess: function(callback){
            var error;
            var viewAccessAvailable = true;
            var viewArrObj= (this.viewType).split('.');

            if(viewArrObj.length > 1) {
                var viewAccess = this.accessObj[viewArrObj[0]][viewArrObj[1]];
                if((typeof viewAccess == "boolean")) viewAccessAvailable = viewAccess;
            }

            if(!viewAccessAvailable) error = this.errorResponse.AuthorisationFailed;
            callback(error, viewAccessAvailable);
        }
    };

    module.exports = function(viewType, accessObj, config){
        return (new viewAccess(viewType, accessObj, config));
    };
})();