(function(){

    var smsSender = require('./smsSender');

    var template = require('../emailGenerator/templates/smsTemplate');

    var smsMailer = module.exports.SmsMailer = function(){

        this.tnxId = '';
        this.callback = '';
    };

    smsMailer.prototype = {

        sender : function(sentData , message){

            console.log("SMS METHOD SENDER CALLED : " ,sentData);

            var sms = smsSender.sendSms(sentData.mobileNo , message);
            sms.send();
        },
        getTemplate : function(templateData , style , accountData){

            return template.getNow(templateData , style , accountData );
        },
        sendMsg : function(smsData , templateData, style){
            var templateStyle = style || 'generic';

            var template = this.getTemplate(templateData , templateStyle);

            //var templateFooter = this.getTemplate(templateData , 'emailFooter');

            //var template = templateBody +  templateFooter;

            this.sender(smsData , template);

            return true;
        }

    };
})();