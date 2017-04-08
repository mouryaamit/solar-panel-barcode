(function(){

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var fileBatch = function(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.FileBatch;
    };

    fileBatch.prototype = {
        addBatch :  function(routed){
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.Save();
        },
        listFileBatch: function(fileId , callback){
            var routed = {
                institutionId           : this.config.instId,
                fileId                  : fileId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.FindMethod(callback);
        },
        removeFileBatch: function(batchId){
            var routed = {
                institutionId           : this.config.instId,
                batchId                 : batchId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.Remove();
        }
    };

    module.exports = function(config , tnxId){
        return (new fileBatch(config , tnxId));
    };
})();