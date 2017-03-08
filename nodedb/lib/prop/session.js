(function(){

    //var Datastore = require('nedb');

    //var otpMethod = require('../../otp/otpMethods');

    var mongoModelName = require('../../lib/mongoQuery/mongoModelObj');

    var errorResponse = require('../../gen/errorResponse');

    //var active = require('../prop/globalConnObj');

    function SessionValidate(config){
        this.config = config;
    }

    SessionValidate.prototype.addSession = function(sid , callback){
        var doc = {
            sessionId : sid,
            sessionAt: new Date(),
            sessionEndTime: (new Date().getTime() + (60 * this.config.sessionTimedOut * 1000))
        };

        var sessionModel = mongoModelName.getModelByModelName(mongoModelName.modelName.UserSession);
        sessionModel.modelObj.update({sessionId : sid}, { $set: doc }, { upsert: true }, function (err, numReplaced) {
            if(callback){
                callback(true);
            }
        });
    };

    SessionValidate.prototype.updateSession = function(sid , callback){
        var doc = {
            sessionId : sid
        };

        var sessionModel = mongoModelName.getModelByModelName(mongoModelName.modelName.UserSession);
        sessionModel.modelObj.update(doc, { $set: { sessionEndTime: (new Date().getTime() + (60 * this.config.sessionTimedOut * 1000)) } }, { multi: true }, function (err, numReplaced) {
            if(callback){
                callback(true);
            }
        });
    };


    SessionValidate.prototype.removeSession = function(sid , callback){

        var doc = {
            sessionId : sid
        };

        var sessionModel = mongoModelName.getModelByModelName(mongoModelName.modelName.UserSession);
        sessionModel.modelObj.remove(doc, { multi: true }, function (err, numRemoved) {
            if(callback){
                callback(true);
            }
        });
    };


    SessionValidate.prototype.validateSession = function(sid , callback){
        var doc = {
            sessionId : sid
        };
        var sessionModel = mongoModelName.getModelByModelName(mongoModelName.modelName.UserSession);
        sessionModel.modelObj.findOne(doc ,callback);
    };

    //================================================================================================================//
    /*function SessionValidate(config){
        var db = new Datastore({ filename: config.neDb.Session });
        db.loadDatabase();
        this.db = db;
        this.config = config;
    }

    SessionValidate.prototype.addSession = function(sid , callback){
        var doc = {
            sessionId : sid,
            sessionAt: new Date(),
            sessionEndTime: (new Date().getTime() + (60 * this.config.sessionTimedOut * 1000))
        };

        this.db.update({sessionId : sid}, { $set: doc }, { upsert: true }, function (err, numReplaced) {
            console.log('Creating Session');
            if(callback){
                callback(true);
            }
        });
    };

    SessionValidate.prototype.updateSession = function(sid , callback){
        var doc = {
            sessionId : sid
        };

        this.db.update(doc, { $set: { sessionEndTime: (new Date().getTime() + (60 * this.config.sessionTimedOut * 1000)) } }, { multi: true }, function (err, numReplaced) {
            console.log('Updated Session');
            if(callback){
                callback(true);
            }
        });
    };


    SessionValidate.prototype.removeSession = function(sid , callback){

        var doc = {
            sessionId : sid
        };

        console.log('removing session');
        this.db.remove(doc, { multi: true }, function (err, numRemoved) {
            console.log(err, numRemoved);
            if(callback){
                callback(true);
            }
        });
    };


    SessionValidate.prototype.validateSession = function(sid , callback){
        var doc = {
            sessionId : sid
        };
        console.log('reached validator session handler sessionValidator');
        this.db.findOne(doc ,callback);
    };*/




    //================================================================================================================//

    var add = module.exports.add = function(req , callback){
        var sess = new SessionValidate(req.config);
        sess.addSession(req.sessionId , callback);
        return true;
    };

    var update = module.exports.update = function(sid , config , callback){
        var sess = new SessionValidate(config);
        sess.updateSession(sid , callback);
        return true;
    };

    var remove = module.exports.remove = function(sid , config){
        var sess = new SessionValidate(config);
        sess.removeSession(sid);
        return true;
    };

    var forceSession = module.exports.force = function(req){

        var prev = req.session.csrfSecret;
        req.session.regenerate(function(err) {
            // will have a new session here
            req.session.csrfSecret = prev;
        });

        return true;
    };

    var destroySession = module.exports.destroySession = function(req){
        var sess = new SessionValidate(req.config);
        sess.removeSession(req.sessionId);
        req.session = null;
        return true;

    };

    var destroy = module.exports.destroy = function(req , callback){
        var sess = new SessionValidate(req.config);
        sess.removeSession(req.sessionId , callback);
        return true;
    };

    var validate = module.exports.validate = function(req , callback){
        var sess = new SessionValidate(req.config);
        sess.validateSession(req.sessionId , callback);
        return true;
    };

    //================================================================================================================//

    function HandleSession(req , callback){
        this.req = req;
        this.callback = callback;
    }

    HandleSession.prototype = {
        sessionCaller: function(){
            //var activity = active.getActiveUser(req.session.userId);

            var session = new SessionMethods(this.req , this.callback);
            var resHandle = session.sessionCheck.bind(session);
            resHandle();
        }
    };

    var SessionMethods = function(request, callMethod){
        this.errorRes = errorResponse.ErrorMessage(request.config);
        this.callback = callMethod;
        this.req = request;
    };

    SessionMethods.prototype = {
        sessionCheck: function(){
            var sessionProcessor = new SessionValidate(this.req.config);
            var validator = sessionProcessor.validateSession.bind(sessionProcessor);
            var resHandle = this.sessionBinderHandler.bind(this);
            validator(this.req.sessionId , resHandle);
        },
        sessionBinderHandler :function(err , result){
            var resHandle = this.sessionInValidate.bind(this);
            if(result){
                var validateTime = new Date().getTime();
                var sessionEndTime = (new Date(result.sessionEndTime).getTime());
                if(validateTime < sessionEndTime){
                    this.req.request.body.userId = this.req.session.userId;
                    this.req.request.body.userSelectedName = this.req.session.userName;
                    this.req.request.body.customersId = this.req.session.customersId;
                    this.req.request.body.customersName = this.req.session.customersName;
                    this.req.request.body.userInform = this.req.session.userInfo;
                    var updateHandle = this.updateComplete.bind(this);
                    update(result.sessionId , this.req.config , updateHandle);
                }else{
                    //if(activity) active.removeActiveUser(req.session.userId);
                    //var otp = otpMethod.otp;
                    //otp.removeOtp(result.sessionId);
                    resHandle();
                }
            }else{
                resHandle();
            }
        },
        updateComplete: function(done){
            this.callback(null , this.req);
        },
        sessionInValidate : function(){
            destroySession(this.req);
            this.req.body = this.errorRes.SessionTimeout;
            this.req.status = this.errorRes.SessionTimeout.status;
            this.callback(this.req , null);
        }
    };

    module.exports.handleSession = function(req , callback){
        return (new HandleSession(req , callback));
    };
})();