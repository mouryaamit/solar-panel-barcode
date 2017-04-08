(function(){

    var mailer = require('./emailMethods');

    var Messenger = function(config , tnxId){
        this.config = config;
        this.tnxId = tnxId;
    };

    Messenger.prototype = {
        sendMessage : function(sendingTo , emailData , style) {

            var mailSender = mailer(this.config , this.tnxId);
            mailSender.sendEmail(sendingTo, emailData, style);
            /*var smsMail = new smsMailer.SmsMailer();
             smsMail.sendMsg(sendInfo, emailData, style);*/
        }
    };

    module.exports = function(config , tnxId){
        return (new Messenger(config , tnxId));
    };
})();