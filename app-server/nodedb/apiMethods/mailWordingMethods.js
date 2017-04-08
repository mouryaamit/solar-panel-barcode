(function(){

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var mailWordingModel = require('../lib/models/dbModel').MailWording;

    function MailWording(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.model = mailWordingModel;
    }

    MailWording.prototype = {
        addMailWording: function(reqBody , callback){
            var routed = {
                institutionId           : this.config.instId,
                mailType                : reqBody.mailType,
                subject                 : reqBody.subject,
                messageContent          : reqBody.messageContent
            };

            this.model.update({institutionId : this.config.instId, mailType : reqBody.mailType} , {$set:routed} , { upsert: true } , function(err , doc){
                callback(null , {message: 'Mail Wording Added'})
            });
        },
        getMailWording: function(reqBody , callback){
            var routed = {
                institutionId           : this.config.instId,
                mailType                : reqBody.mailType
            };

            this.model.findOne(routed , function(err , result){
                if(!result){
                    callback(null , {});
                }else{
                    callback(null , result);
                }
            });
        },
        replaceWording: function(mailType ,rUser,  rString, callback, rCustomerName, rAddress1, rAddress2){
            this.callback = callback;
            this.repStr = rString;
            this.repUser = rUser;
            this.rAddress1 = rAddress1;
            this.rAddress2 = rAddress2;
            this.rCustomerName = rCustomerName;

            var wordReplace = {
                "Temporary User ID": '#UserID',
                "WelcomeUser": '#User',
                "address1": '#address1',
                "address2": '#address2',
                "customerName": '#customerName',
                "Temporary Password": '#Password',
                "Enrollment": '#EnrollmentDate',
                "Forgot Password": '#Password'
            };

            this.stringVariable = wordReplace[mailType];
            this.stringUserName = wordReplace['WelcomeUser'];
            var routed = {
                institutionId           : this.config.instId,
                mailType                : mailType
            };
            var resHandle = this.mailReplacedString.bind(this);
            this.model.findOne(routed , resHandle);
        },
        mailReplacedString: function(err , result){
            if(!result){
                this.callback(true , null);
            }else{
                var msgStr = result.messageContent;
                msgStr = msgStr.replace(this.stringVariable , this.repStr);
                msgStr = msgStr.replace(this.stringUserName , this.repUser);
                msgStr = msgStr.replace('address1' , this.rAddress1);
                msgStr = msgStr.replace('address2' , this.rAddress2);
                msgStr = msgStr.replace('customerName' , this.rCustomerName);
                this.callback(null , msgStr);
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new MailWording(config , tnxId));
    };
})();