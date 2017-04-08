(function(){

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    function MultiLingual(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.MultiLingual;
        this.direct = require('../lib/models/dbModel').MultiLingual;
    }

    MultiLingual.prototype = {
        addInstituteLang: function(reqBody , callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                languageSelected: reqBody.selectedLang
            };

            var resHandle = this.multiLangAdded.bind(this);
            this.direct.update({institutionId: this.config.instId}, {$set: routed}, {upsert: true}, resHandle);
        },
        multiLangAdded: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message: 'Language Set Updated'});
            }
        },
        listInstituteLang: function(reqBody , callback){
            this.callback = callback;

            var fields = 'languageSelected';
            var routed = {
                institutionId              : this.config.instId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId , fields);
            var resHandle = this.returnList.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        returnList: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , result);
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new MultiLingual(config , tnxId));
    };
})();