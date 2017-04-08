(function(){

    var path = require('path');

    var toPdf = require('./htmlToPdf');

    var errorResponse = require('../errorResponse');

    var template = require('../../lib/emailGenerator/emailMethods');

    var Pdf = function(config , tnxId,userId){
        this.config = config;
        this.tnxId = tnxId;
        this.userId = userId;
        this.errorResponse = errorResponse.ErrorMessage(config);
    };

    Pdf.prototype = {
        parsePdf : function(pdfMethod ,templateData, filename , callback){
            this.callback = callback;
            var resHandle = this[pdfMethod];
            resHandle = (typeof resHandle == "undefined")? this["defaultMethod"] : this[pdfMethod];
            resHandle(templateData, filename , callback,this.config,this.userId);
        },
        activeUsersReport : function(templateData, filename , callback,config,userId){
            var getHtml = template(config , this.tnxId);
            var html = getHtml.getTemplate(templateData , 'activeUsersReportHeaders');
            html += getHtml.getTemplate(templateData , 'activeUsersReportBody');
            var pdf = toPdf(config , this.tnxId);
            var generated = pdf.generate.bind(pdf);
            generated(html ,filename , callback,userId);
        },
        invalidReport : function(templateData, filename , callback,config,userId){
            var getHtml = template(config , this.tnxId);
            var html = getHtml.getTemplate(templateData , 'invalidLoginHeaders');
            html += getHtml.getTemplate(templateData , 'invalidLoginBody');

            var pdf = toPdf(config , this.tnxId);
            var generated = pdf.generate.bind(pdf);
            generated(html ,filename , callback,userId);
        },
        sessionReport : function(templateData, filename ,callback,config,userId){
            var getHtml = template(config , this.tnxId);
            var html = getHtml.getTemplate(templateData , 'sessionHeaders');
            html += getHtml.getTemplate(templateData , 'sessionBody');

            var pdf = toPdf(config , this.tnxId);
            var generated = pdf.generate.bind(pdf);
            generated(html ,filename , callback,userId);
        },
        userActivityReport : function(templateData, filename , callback,config,userId){
            var getHtml = template(config , this.tnxId);
            var html = getHtml.getTemplate(templateData , 'userActivityHeaders');
            html += getHtml.getTemplate(templateData , 'userActivityBody');

            var pdf = toPdf(config , this.tnxId);
            var generated = pdf.generate.bind(pdf);
            generated(html ,filename , callback,userId);
        },
        transactionReport : function(templateData, filename , callback,config,userId){
            var getHtml = template(config , this.tnxId);
            //var filePath = path.resolve('./nodedb/gen/pdfGenerator/vsoftImage.png');

            //var htmlTemplateStart = '<style>.contentBox{position:absolute;} .backgroundImage{ position:absolute; height: 1390px; content: url(file://'+ filePath +'); background-repeat: repeat-y;}</style><div class="backgroundImage"></div>';
            var htmlTemplateStart = '';
            var htmlBody = getHtml.getTemplate(templateData , 'transactionHeaders');
            htmlBody += getHtml.getTemplate(templateData , 'transactionBody');

            var html = htmlTemplateStart + htmlBody;
            var pdf = toPdf(config , this.tnxId);
            var generated = pdf.generate.bind(pdf);
            generated(html ,filename , callback, userId);
        },
        defaultMethod: function(templateData, filename ,callback,config,userId){
            callback(true , null);
        }
    };

    module.exports = function(config , tnxId,userId){
        return (new Pdf(config , tnxId,userId));
    };
})();