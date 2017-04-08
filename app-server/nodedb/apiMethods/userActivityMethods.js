(function(){

    var _ = require('underscore');

    var moment = require('moment');

    var userMethods = require('./userMethods');

    var lockUserMethod = require('./lockUserMethods');

    var errorResponse = require('../gen/errorResponse');

    var adminMethods = require('./bankAdminMethods');

    var downloader = require('./fileDownloadMethods');

    var userActivity = function(config , tnxId){
        this.config = config;
        this.tnxId = tnxId;
        this.queryAttempts = false;
        this.errorResponse = errorResponse.ErrorMessage(config);
    };

    userActivity.prototype = {
        getUserActivityReport: function(reqBody , callback){

            (reqBody.download == 'csv' || reqBody.download == 'tsv' || reqBody.download == 'pdf')? this.downloadFile = true : this.downloadFile = false;

            this.reqBody  = reqBody;
            var resHandle = this.getLoginAttemptsData.bind(this);
            this.callback = callback;
            this.userId = reqBody.userId;
            this.downloadMethod = downloader(this.config , reqBody.download , 'AdminUserName' , reqBody.userId, this.tnxId);
            //if(typeof reqBody.loginAttemptsBetween == "object" || reqBody.inValidAttempts) resHandle = this.getLoginAttemptsData.bind(this);

            var routed = {
                institutionId           : this.config.instId
            };
            if(typeof reqBody.passwordExpirationBetween == "object"){
                var lessThan = (new Date(reqBody.passwordExpirationBetween.lessThan).getTime() + 60 * 60 * 23.99 * 1000);
                routed["$and"] = [{ passwordExp: { $gte: new Date(reqBody.passwordExpirationBetween.fromDate)} }, { passwordExp: { $lte: new Date(lessThan)} } ];
            }
            if(reqBody.noBankingSince) routed.lastLogin = { $lte : new Date(reqBody.noBankingSince)};
            if(reqBody.userName) routed.userName = reqBody.userName;

            if(reqBody.customerType == 'bankUser'){
                var user = userMethods(this.config , this.tnxId);
                if(reqBody.customerName && reqBody.customerName != '') routed.customerName = reqBody.customerName;

                user.defaultAllMethod(routed , resHandle);
            }else{

                var admin = adminMethods(this.config , this.tnxId);
                resHandle = this.getAdminLoginAttemptsData.bind(this);
                if(reqBody.customerName && reqBody.customerName != '') routed.name = reqBody.customerName;

                admin.defaultAllMethod(routed , resHandle);
            }
        },
        getAdminLoginAttemptsData: function(err , result){
            if(err) result = [];
            this.userObj = [];
            this.recCounter = 0;
            if(result.length > 0) {
                this.recActCounter = result.length;
                for (var i = 0; i < result.length; i++) {
                    var routed = {};
                    if(typeof this.reqBody.loginAttemptsBetween == "object" || this.reqBody.inValidAttempts) this.queryAttempts = true;
                    if(typeof this.reqBody.loginAttemptsBetween == "object"){
                        var lessThan = (new Date(this.reqBody.loginAttemptsBetween.lessThan).getTime() + 60 * 60 * 23.99 * 1000);
                        routed["$and"] = [{ lockedDate: { $gte: new Date(this.reqBody.loginAttemptsBetween.fromDate)} }, { lockedDate: { $lte: new Date(lessThan)} } ];
                    }
                    if(this.reqBody.inValidAttempts) routed.counter = this.reqBody.inValidAttempts;
                    var userObj = {
                        customerName    : result[i].name,
                        userId          : result[i].userName,
                        createdOn       : moment(result[i].createdOn).format('L'),
                        lastLogin       : moment(result[i].lastLogin).format('L'),
                        passwordExp     : moment(result[i].passwordExp).format('L'),
                        attempts        : 0
                    };

                    var updateTo = this.addCounterInfo.bind(this);
                    updateTo(userObj);
                }
            }else{
                this.sendProcessResult();
            }
        },
        getLoginAttemptsData: function(err , result){
            if(err) result = [];
            this.userObj = [];
            this.recCounter = 0;
            if(result.length > 0) {
                this.recActCounter = result.length;
                for (var i = 0; i < result.length; i++) {
                    var routed = {
                        institutionId           : this.config.instId
                    };

                    if(typeof this.reqBody.loginAttemptsBetween == "object" || this.reqBody.inValidAttempts) this.queryAttempts = true;
                    if(typeof this.reqBody.loginAttemptsBetween == "object"){
                        var lessThan = (new Date(this.reqBody.loginAttemptsBetween.lessThan).getTime() + 60 * 60 * 23.99 * 1000);
                        routed["$and"] = [{ lockedDate: { $gte: new Date(this.reqBody.loginAttemptsBetween.fromDate)} }, { lockedDate: { $lte: new Date(lessThan)} } ];
                    }
                    if(this.reqBody.inValidAttempts) routed.counter = this.reqBody.inValidAttempts;
                    var updateTo = this.addCounterInfo.bind(this);

                    var userObj = {
                        customerName    : result[i].customerName,
                        userId          : result[i].userName,
                        createdOn       : moment(result[i].createdOn).format('L'),
                        lastLogin       : moment(result[i].lastLogin).format('L'),
                        passwordExp     : moment(result[i].passwordExp).format('L'),
                        attempts        : ' '
                    };

                    var userCounter = new SearchUserCounter(userObj, updateTo);
                    var resHandle = userCounter.getAllCounter.bind(userCounter);
                    if(this.queryAttempts) resHandle = userCounter.getTheCounter.bind(userCounter);
                    var lock = lockUserMethod(this.config, this.tnxId);
                    var lockUser = lock.defaultAllMethod.bind(lock);
                    routed.userId = result[i].userId;
                    lockUser(routed, resHandle);
                }
            }else{
                this.sendProcessResult();
            }
        },
        addCounterInfo: function(result){
            this.recCounter = this.recCounter + 1;
            if(result) this.userObj.push(result);

            if(this.recActCounter == this.recCounter) this.sendProcessResult();
        },
        sendProcessResult: function(){
            if(this.downloadFile){
                this.userObj = _.sortBy(this.userObj, function(obj){
                    if(!obj.customerName || obj.customerName == '') return '';
                    return obj.customerName.toLowerCase();
                });
                var headers = ['Customer Name' , 'User ID' , 'Created On' , 'Last Login' , 'Password Expires' , 'Invalid Login Attempts'];

                this.downloadMethod.parseData(this.userObj , headers , this.callback , 'userActivityReport', null ,this.userId);
            }else{
                this.callback(null , this.userObj);
            }
        }
    };

    var SearchUserCounter = function(resultObj , updateFunc){
        this.searchObj = resultObj;
        this.update = updateFunc;
    };

    SearchUserCounter.prototype = {
        getTheCounter : function(err , countObj){
            if(countObj){
                this.searchObj.attempts = countObj.counter;
            }else{
                this.searchObj = null;
            }
            this.update(this.searchObj);
        },
        getAllCounter : function(err , countObj){
            if(countObj){
                this.searchObj.attempts = countObj.counter;
                this.update(this.searchObj);
            }else{
                this.searchObj.attempts = 0;
                this.update(this.searchObj);
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new userActivity(config , tnxId));
    };
})();