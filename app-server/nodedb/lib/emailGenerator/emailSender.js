(function () {

    var nodemailer = require('nodemailer');

    exports.sendGeneratedEmail = function(htmlPage , sendData){
        var mailTransporter = nodemailer.createTransport({
            auth : sendData.auth,
            host : sendData.host,
            port : sendData.port,
            tls : {
                rejectUnauthorized: sendData.rejectUnauthorized
            }

        });

        var mailOptions = {
            from:sendData.fromName+'<'+sendData.from+'>',
            to: sendData.sendTo, // list of receivers
            subject: sendData.subject, // Subject line
            html: htmlPage
        };

        mailTransporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.error(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });
    };
})();