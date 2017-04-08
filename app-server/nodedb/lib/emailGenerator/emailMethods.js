(function(){

    var fs = require('./emailSender');

    var emailSender = require('./emailSender');

    var eMailer = function(config , tnxId){
        this.tnxId = tnxId;
        this.config= config;
    };

    eMailer.prototype = {
        sender : function(sentData , html){

            var sendData = {
                sendTo              : sentData.emailId || this.config.customerDataInfoSendTo, // sent to emailId
                subject             : sentData.subject || 'IRIS E-BANKING', // sent subject
                host                : this.config.mailerSetting.host,
                port                : this.config.mailerSetting.port,
                fromName            : this.config.mailerSetting.fromName,
                from                : this.config.mailerSetting.from,
                rejectUnauthorized  : this.config.mailerSetting.rejectUnauthorized,
                auth                : this.config.mailerSetting.auth
            };
            emailSender.sendGeneratedEmail(html , sendData);
        },
        getTemplate : function(templateData , style , accountData){

            var templateEngine;
            try{
              //templateEngine = require('../../templates/emailMessages/'+ this.config.emailTemplateFolder + '/'+ this.config.setLang +'/allTemplate');
               templateEngine = require('../../templates/emailMessages/'+ this.config.emailTemplateFolder + '/EN/allTemplate');
                // HARDCODED TO ENGLISH. AS DISCUSSED WITH SWAHAV (AMIT MOURYA). AS ALERTS SYSTEM ALSO NOT IN MULTILINGUAL
            }catch(err){
                //console.log('Cannot require the file at ../../templates/emailMessages/'+ this.config.emailTemplateFolder + '/'+ this.config.setLang +'/allTemplate');
                templateEngine = require('../../templates/emailMessages/defaultTemplate');
            }

            var template = templateEngine(this.config , this.tnxId);
            var resHandle = template[style];
            return (typeof resHandle == "undefined")? template['generic']() : template[style](templateData , accountData);
        },
        sendEmail : function(sendInfo , templateData, style){

            var templateBody = this.getTemplate(templateData , style);
            var templateFooter = this.getTemplate(templateData , 'bankMailFooter');
            var template = templateBody +  templateFooter;

            this.sender(sendInfo , template);
            return true;
        },
        getEmailMsg : function(templateData, style){

            var templateBody = this.getTemplate(templateData , style);
            var templateFooter = this.getTemplate(templateData , 'bankMailFooter');
            var template = templateBody +  templateFooter;

            return template;
        }
    };

    module.exports = function(config , tnxId){
        return (new eMailer(config , tnxId));
    };
})();