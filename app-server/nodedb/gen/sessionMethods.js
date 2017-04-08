(function(){

    var session = require('../lib/prop/session');

    var errorResponse = require('../gen/errorResponse');

    function SessionHandler (req , tnxId){
        this.tnxId = tnxId;
        this.config = req.config;
        this.request = req;
        this.errorResponse = errorResponse.ErrorMessage(this.config);
    }

    SessionHandler.prototype = {
        newSession: function(){
            session.force(this.request);
        },
        logout : function(callback){
            session.destroySession(this.request,callback);
        },
        login : function(callback){
            /*var resHandle = this.validateCallback.bind(this);
            session.validate(this.request , resHandle);*/
            var referer = this.request.req.headers.referer ? this.request.req.headers.referer.toString() : "";
            referer = referer.split("/")
            referer = referer[referer.length-2]
            session.add(this.request , callback, referer);
            this.request.session.userId = this.request.request.body.userId;
            this.request.session.userName = this.request.request.body.userName;
            this.request.session.customersId = this.request.request.body.customersId;
            this.request.session.customersName = this.request.request.body.customerName;
            this.request.session.userInfo = this.request.request.body.userInfo;
            this.request.session.viewAccess = this.request.request.body.viewAccess;
        },
        validateCallback : function(err , result) {
            if (result) {
                //var secret = this.request.session.secret;
                //session.destroySession(this.request);
                var referer = this.request.req.headers.referer ? this.request.req.headers.referer.toString() : "";
                referer = referer.split("/")
                referer = referer[referer.length-2]
                session.update(this.request.sessionId , this.config, null, referer);
                //session.add(this.request);
                //this.request.session.secret = secret;
            } else {
                session.add(this.request , callback);
            }
        },
        sessionActiveCheck: function(callback){
            this.sessionId = this.request.sessionId;
            this.callback = callback;

            //var blocker = new LoginBlock.LoginStrategy();
            //blocker.getLoginCount(this.request.body.userId , callback);
        },
        customerLogin: function(errorObj , responseObj){
            this.loginObj = {
                errorObj        : errorObj ,
                responseObj     : responseObj
            };

            if(errorObj){
                this.callback(errorObj , responseObj);

            }else{
                active.removeActiveUser(this.request.body.userId);
                var destroyed = this.destroyedCallback.bind(this);
                session.destroy(this.sessionId, destroyed);
            }
        },
        destroyedCallback: function(result){

            var otp = otpMethod.otp;
            otp.removeOtp(this.sessionId);
            this.callback(this.loginObj.errorObj , this.loginObj.responseObj);
        }
    };

    module.exports.SessionHandle = function(req , tnxId){
        return (new SessionHandler(req , tnxId));
    };
})();