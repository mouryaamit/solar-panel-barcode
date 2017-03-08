(function(){

    var mongoCaller = require('../lib/mongoQuery/mongoCaller');

    var mongoMethods = require('../lib/mongoQuery/mongoDbMethod');

    function MQuery(model , routed , tnxId , fields){
        this.model = model;
        this.routed = routed;
        this.tnxId = tnxId;
        this.fields = fields;
    }

    MQuery.prototype.FindOneMethod = function(callback){
        var processMongodbQuery = this.QueryDb.bind(this);
        processMongodbQuery('findOne' , callback);
    };

    MQuery.prototype.FindMethod = function(callback){
        var processMongodbQuery = this.QueryDb.bind(this);
        processMongodbQuery('find' , callback);
    };

    MQuery.prototype.Count = function(callback){

        var mongo = new mongoMethods.Methods(this.model , this.routed , this.tnxId);
        mongo.count(callback);
    };


    MQuery.prototype.Save = function(callback){

        var mongo = new mongoMethods.Methods(this.model , this.routed , this.tnxId);
        mongo.save(callback);
    };

    MQuery.prototype.Remove = function(callback){

        var mongo = new mongoMethods.Methods(this.model , this.routed , this.tnxId);
        mongo.remove(callback);
    };

    MQuery.prototype.QueryDb = function(method , callback){

        var mongoQueryObj = new mongoCaller.MongoQueryBinder();

        var mongoQueryInitObj = mongoQueryObj.getBizObj(method);

        //this.utils.log(this.tnxId , 'Querying MongoDb' , this.config.tags.mongoBefore);

        var mongoQueryMethodObj = new mongoQueryInitObj(this.model , this.routed , this.tnxId , this.fields);

        mongoQueryObj.signature(callback , mongoQueryMethodObj);
    };

    module.exports.MongoQuery = function(model , routed , tnxId , fields){
        return (new MQuery(model , routed , tnxId , fields));
    }
})();