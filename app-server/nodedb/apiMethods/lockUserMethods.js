(function(){

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var mongoModelObj = require('../lib/mongoQuery/mongoModelObj');

    var queryDb = require('../databases/queryMongo');

    var LockUserModel = require('../lib/models/dbModel').LockUser;

    function LockUser(config , tnxId){
        var dated = new Date();
        this.dated = (dated.getMonth() + 1) + "/" + dated.getDate() + "/" + dated.getFullYear().toString().substr(2,2);
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.model = mongoModelObj.modelName.LockUser;
    }

    LockUser.prototype = {

        getLoginCount : function(userId , callback){
            this.routed = {
                institutionId           : this.config.instId,
                userId                  : userId
            };
            this.method = 'FindOneMethod';
            this.callback = callback;
            this.responseHandle = this.returnLoginCount.bind(this);

            var query = this.queryLockedUser.bind(this);
            query();
        },
        returnLoginCount: function(err , result){
            var doc = {counter : 0};
            if(!result){
                this.callback(doc);
            }else{
                doc.counter = result.counter;
                doc.reason = result.reason;
                doc.userId = result.userId;
                doc.userName = result.userName;
                doc.lockedTimes = result.lockedTimes || 0;
                this.callback(doc);
            }
        },
        queryLockedUser: function(){
            var Db = queryDb.MongoQuery(this.model , this.routed , this.tnxId);
            Db[this.method](this.responseHandle);
        },
        addLoginCount : function(userObj ,reason){

            var routed = { institutionId : this.config.instId, userId: userObj.userId };

            LockUserModel.update(routed, { $set:  {institutionId : this.config.instId, lockedDate : new Date(this.dated) , userId : userObj.userId , userName : userObj.userName , reason : reason }, $inc: { counter: 1 }},{upsert : true},function(err , doc){
            });

            return true;
        },
        adminLockUser : function(userObj , reason){

            var routed = { userId: userObj.userId };
            LockUserModel.update(routed, { $set: {lockedDate : new Date(this.dated), userId : userObj.userId , userName : userObj.userName , counter: 3 , reason : reason }}, { upsert: true }, function (err, numReplaced) {
            });

            return true;
        },
        resetLoginCount : function(userId){

            var routed = { institutionId : this.config.instId, userId: userId };

            LockUserModel.update(routed, { $set: { counter: 0 }}, { upsert: true }, function (err, numReplaced) {
            });

            return true;
        },
        removeLoginCount : function(userId){

            var routed = { institutionId : this.config.instId, userId: userId };
            /*LockUserModel.remove({ userId: userId }, function (err, numRemoved) {
                // numRemoved = 1
            });*/
            LockUserModel.update(routed, { $set: { counter: 0 } , $inc: { lockedTimes: 1 }}, { upsert: true }, function (err, numReplaced) {
            });

            return true;
        },
        listLockedUser : function(callback){
            this.callback = callback;
            var bankPolicyMethod = require('../supportMethods/bankPolicyMethods');
            var bank = bankPolicyMethod(this.config , this.tnxId);
            var resHandle = this.getBankPolicy.bind(this);
            bank.getBankPolicy({},resHandle);
        },
        getBankPolicy:  function(err , result){
            this.routed = {institutionId : this.config.instId, counter: result.passwordRestrictions.failedLoginAttempts};
            this.method = 'FindMethod';
            this.responseHandle = this.returnLockedList.bind(this);

            var query = this.queryLockedUser.bind(this);
            query();
        },
        returnLockedList: function(err , result){
            if(err){
                this.utils.log(this.tnxId , err , 'console.log');
                //console.log(err);
            }else{
                this.callback(null , result);
            }
        },
        defaultAllMethod: function(routed , callback){
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.FindOneMethod(callback);
        }
    };

    module.exports = function(config , tnxId){
        return (new LockUser(config , tnxId));
    };
})();