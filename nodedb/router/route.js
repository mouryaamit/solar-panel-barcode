(function () {
    var _ = require('underscore');

    var handleSession = require('../lib/prop/session');

    var accessHandler = require('../lib/prop/checkViewAccess');

    var globalConn = require('../lib/prop/globalConnObj');

    var genrateBarcode = require('../api/genrateBarCodeApi')

    module.exports.apiCalls = {
        genrateBarcode                  : 'genrateBarcode'
    };

    function Route(app , rin) {
        var routes = [
            {
                api                 : 'genrateBarcode',
                func                : genrateBarcode.api
            }

        ];

        return function(callback){
            var router = new RouteApi(rin , routes);
            var resHandle = router.sessionController.bind(router);
            resHandle(callback);
        };
    }

    var RouteApi = function(rin , routes){
        this.rin = rin;
        this.rin.config.populate();
        this.rin.config = this.rin.config.getConfig();
        this.rin.config.userCurrentIp = this.rin.header['x-forwarded-for'] || this.ip;
        this.rin.config.instId = this.rin.header['x-inst-id'] || '1';
        this.rin.config.setLang = this.rin.header['x-lang'] || 'EN';
        this.tnxId = rin.header['x-request-id'] || '';
        this.routes = routes;
        this.apiObj = _.findWhere(routes , {api : this.rin.callApi});
    };

    RouteApi.prototype = {
        sessionReturn : function(error , success){
            if(error){
                this.callback(null , error);
            }else{
                var viewPerm = this.apiObj.viewPerm;
                var accessObj = this.rin.session.viewAccess;
                var viewAccess = accessHandler(viewPerm, accessObj, this.rin.config);
                var resHandle = this.checkUserAccess.bind(this);
                viewAccess.checkViewAccess(resHandle);
                //this.apiObj.func(this.rin, this.callback);
            }
        },
        sessionController: function(callback){
            this.callback = callback;
            if(globalConn.isDown('Channel') && this.rin.method == "POST"){
                this.rin.body = {status: 400 ,responseData: {message: 'Database Service Not available'}};
                this.rin.status = 400;
                return this.callback(null , this.rin);
            }

            ///multipart/form-data; boundary=----WebKitFormBoundaryT9j7yrBlYg9mN0Em multipartHeader =

            var multiHead = (this.rin.header['content-type']) || '';
            var multipartHeader = multiHead.split(';');
            if(!this.apiObj.contentType || this.apiObj.contentType == this.rin.header['content-type'] || this.apiObj.contentType == multipartHeader[0]){

                if(this.apiObj.inSession){
                    var resHandle = this.sessionReturn.bind(this);
                    var sessionManagement = handleSession.handleSession(this.rin , resHandle);
                    var sessionHandle = sessionManagement.sessionCaller.bind(sessionManagement);
                    sessionHandle();
                }else{
                    this.apiObj.func(this.rin , this.callback);
                }

            }else{
                this.rin.body = {status: 415 ,responseData: {message: 'Unsupported Media Type'}};
                this.rin.status = 415;
                return this.callback(null , this.rin);
            }
        },
        checkUserAccess: function(error , isAccess){
            if(error){
                this.rin.body = error;
                this.rin.status = error.status;
                this.callback(null , this.rin);
            }else{
                //check if otp is required
                var otpService = this.apiObj.otpService;
                if(otpService && otpService != ''){
                    var otpConfig = otpConfigHandler(this.rin.config , this.tnxId);
                    var resHandle = this.handleOtpService.bind(this);
                    otpConfig.isOtpConfigAvailable(otpService , resHandle);
                }else{
                    this.apiObj.func(this.rin, this.callback);
                }
            }
        },
        handleOtpService: function(isOtpRequired , otpData){
            if(isOtpRequired){
                this.rin.request.body.otpData = otpData;
                this.rin.request.body.otpData['emailId'] = this.rin.session.userInfo.emailId;
                //this.rin.request.body.otpData['phoneNo'] = this.rin.session.userInfo.phoneNo;
                this.rin.request.body.otpData['customersId'] = this.rin.session.customersId;
                this.rin.request.body.otpData['customerName'] = this.rin.session.customerName;
                this.rin.request.body.otpData['createdBy'] = this.rin.session.createdBy;
                this.rin.request.body.otpService = this.apiObj.otpService;
                this.rin.request.body.sessionId = this.rin.sessionId;
                var otpApi = _.findWhere(this.routes , {api : 'otpHandler'});
                otpApi.func(this.rin, this.callback);
            }else{
                this.apiObj.func(this.rin, this.callback);
            }
        }
    };

    module.exports.route = function(app , rin){
        return (new Route(app , rin));
    };
})();