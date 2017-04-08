(function(){

    var moment = require('moment');

    var schema = require('../gen/coreResponseSchema');

    var paperwork = require('../lib/utils/paperwork');

    var messenger = require('../lib/emailGenerator/messenger');

    var mailer = require('../lib/emailGenerator/emailMethods');

    var alertWS = require('../server/WsAlerts/vsoftAlertWs');

    var generateId = require('time-uuid/time');


    function Reminders(config , tnxId){
        var utils = require('../lib/utils/utils');
        var errorResponse = require('../gen/errorResponse');
        var successResponse = require('../gen/successResponseMessage');
        var mongoModelName = require('../lib/mongoQuery/mongoModelObj');
        var dated = new Date();
        this.dated = (dated.getMonth() + 1) + "/" + dated.getDate() + "/" + dated.getFullYear().toString().substr(2,2);
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.Reminder;
    }

    Reminders.prototype = {
        addReminders: function(reqBody , callback){
            this.callback = callback;

            /*var scheduling = this.getScheduleNextDate.bind(this);
            var schedule = scheduling(this.dated , reqBody.schedule);
            if(reqBody.schedule == "Once") schedule = reqBody.reminderDate;*/
            this.resHandler = this.completeAddReminder.bind(this);

            this.routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                reminderId              : this.utils.getToken(),
                reminderDate            : new Date(reqBody.reminderDate),
                schedule                : reqBody.schedule,
                showNextAt              : new Date(reqBody.reminderDate),
                reminderMessage         : reqBody.reminderMessage
            };

            var query = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                reminderDate            : new Date(reqBody.reminderDate),
                reminderMessage         : reqBody.reminderMessage
            };

            var mongo = this.utils.initMongo(this.model ,query , this.tnxId);
            var resHandle = this.checkSameReminder.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        completeAddReminder: function(){
            var mongo = this.utils.initMongo(this.model ,this.routed , this.tnxId);
            var resHandle = this.reminderCreated.bind(this);
            mongo.Save(resHandle);
        },
        checkSameReminder: function(err , result){
            if(!result){
                this.resHandler();
            }else{
                var error = this.errorResponse.SameReminderFailed;
                this.callback(error , null);
            }
        },
        reminderCreated: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message: this.successResponse.SetReminder});
            }
        },
        showReminders: function(reqBody , callback){
            this.callback = callback;

            var fields = 'reminderId reminderDate schedule showNextAt reminderMessage';

            var routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                reminderDate            : { "$gte" : new Date(this.dated) },
                showNextAt              : new Date(this.dated)
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId , fields);
            var resHandle = this.reminderListReturn.bind(this);
            mongo.FindMethod(resHandle);
        },
        listReminders: function(reqBody , callback){
            this.callback = callback;

            var fields = 'reminderId reminderDate schedule showNextAt reminderMessage';

            var routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId , fields);
            var resHandle = this.reminderListReturn.bind(this);
            mongo.FindMethod(resHandle);
        },
        reminderListReturn: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , result);
            }
        },
        scheduleReminder: function(reqBody , callback){
            this.callback = callback;

            var routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                reminderId              : reqBody.reminderId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.scheduleUpdate.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        scheduleReminderList: function(){

            var routed = {
                //reminderDate    : {"$gte" : new Date(this.dated) },
                institutionId           : this.config.instId,
                showNextAt              : new Date(this.dated)
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.updateSRList.bind(this);
            mongo.FindMethod(resHandle);
        },
        updateSRList: function(err , result){
            var userMethods = require('../apiMethods/userMethods');
            var ReminderModel = require('../lib/models/dbModel').Reminder;
            for(var i = 0; i < result.length; i++){

                var routed = {
                    institutionId           : this.config.instId,
                    reminderId              : result[i].reminderId
                };

                var nextAt = this.utils.getScheduleNextDate(result[i].reminderDate, result[i].showNextAt , result[i].schedule);
                var updatedInfo = {
                    showNextAt      : new Date(nextAt)
                };

                var userRouted = {
                    institutionId           : this.config.instId,
                    userId                  : result[i].userId
                };
                var user = userMethods(this.config , this.tnxId);
                var rMail = new ReminderMail(result[i].reminderMessage , this.config , this.tnxId);
                var userEmailHandle = rMail.sendReminderEmails.bind(rMail);
                user.defaultMethod(userRouted ,userEmailHandle);

                ReminderModel.update(routed , {$set:updatedInfo}, function(err , doc){
                });
            }
        },
        scheduleUpdate: function(err , result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                result.showNextAt = this.utils.getScheduleNextDate(result.reminderDate, result.showNextAt , result.schedule);
                result.save();
                this.callback(null , result);
            }
        },
        editReminder: function(reqBody , callback){
            this.callback = callback;

            this.reminderDate = reqBody.reminderDate;
            this.schedule = reqBody.schedule;
            this.reminderMessage = reqBody.reminderMessage;

            this.query = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                reminderDate            : new Date(reqBody.reminderDate),
                reminderMessage         : reqBody.reminderMessage
            };

            var routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                reminderId              : reqBody.reminderId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.verifyEdit.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        verifyEdit: function(err , result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.resHandler = this.completeEditReminder.bind(this);
                this.result = result;

                var mongo = this.utils.initMongo(this.model ,this.query , this.tnxId);
                var resHandle = this.checkSameReminder.bind(this);
                mongo.FindOneMethod(resHandle);
            }
        },
        completeEditReminder: function(){
            /*var scheduled = this.getScheduleNextDate(this.dated , this.schedule);
            if(this.schedule == "Once") scheduled = this.reminderDate;*/

            this.result.reminderDate = new Date(this.reminderDate);
            this.result.schedule = this.schedule;
            this.result.reminderMessage = this.reminderMessage;
            this.result.showNextAt = new Date(this.reminderDate);
            this.result.save();
            this.callback(null , {message: this.successResponse.UpdateReminder});
        },
        deleteReminder: function(reqBody , callback){
            this.callback = callback;

            this.reminderDel = 0;
            if(paperwork.accepted(schema.deleteReminders, reqBody)) {
                this.bodyLen = reqBody.reminderList.length;

                for (var i = 0; i < this.bodyLen; i++) {

                    var routed = {
                        institutionId           : this.config.instId,
                        reminderId              : reqBody.reminderList[i].reminderId
                    };

                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    var resHandle = this.deleteComplete.bind(this);
                    mongo.Remove(resHandle);
                }
            }else{
                var error = this.errorResponse.BatchDeAuthorizeFailed;
                this.callback(error , null);
            }
        },
        deleteComplete: function(done){
            this.reminderDel = this.reminderDel + 1;

            if(!done){
                var error = this.errorResponse.OperationFailed;
                this.utils.log(this.tnxId , error , 'console.log');
                //console.log(error , null);
            }else{

                if(this.reminderDel == this.bodyLen){
                    this.callback(null , {message : this.successResponse.RemoveReminder});
                }
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new Reminders(config , tnxId));
    };

    function ReminderMail(reminderMsg , config , tnxId){
        this.reminderMsg = reminderMsg;
        this.config = config;
        this.tnxId = tnxId;
    }

    ReminderMail.prototype = {
        sendReminderEmails: function(err ,result){
            if(result){
                var sendingObj = {
                    customerName: result.customerName,
                    reminderMessage: this.reminderMsg
                };
                var mailGenerator = mailer(this.config , this.tnxId);
                var msg = mailGenerator.getEmailMsg(sendingObj, 'reminderMail');

                var vfxRequestId = generateId();
                var requestId = generateId();
                var requestObj = {
                    config : this.config,
                    requestId: requestId,
                    vfxRequestId: vfxRequestId,
                    requestBody: {
                        "REQUEST_NAME": "AlertRq",
                        "INSTANCE": {
                            "alertType": 'OTHER',
                            "bankId": this.config.instId,
                            "customerId":'0',
                            "emailInd":true,
                            "smsInd":false,
                            "emailAddress":this.config.customerDataInfoSendTo,
                            "subject": "Reminder",
                            "message": msg,
                            "userId":result.userId,
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };


                var validateResponse = function(error , response){};


                var ws = alertWS(requestObj , validateResponse);
                ws.requestVsoftAlertServer();

                /*var sendingTo = {
                    subject: 'Reminder'
                };
                var postOffice = messenger(this.config , this.tnxId);
                postOffice.sendMessage(sendingTo, sendingObj, 'reminderMail');
           */ }
        }
    };
})();