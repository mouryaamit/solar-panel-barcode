(function(){

    var moment = require('moment');

    function EmailTemplate (config , tnxId){
        this.config = config;
        this.tnxId = tnxId;
    }

    EmailTemplate.prototype = {
        generic : function(){
            return '<p>Dear Customer,</p><p>Wishing you the best.</p>';
        },
        invalidLoginHeaders: function(){
            return '<br/><table>'+
                '<thead>'+
                '<tr>'+
                '<td style="font-size: 13px;border-left: 1px solid black;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Date</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Time</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">User ID</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">IP Address</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Valid User ID</td>'+
                '</tr>'+
                '</thead>'
        },
        invalidLoginBody: function(data){

            var dataColl = '';
            for(var i = 0; i < data.length ; i++){
                dataColl += '<tr>'+
                '<td style="font-size: 8px;border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].dated +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].time +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].userId +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].ipAddress +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].isValidUserId +'</td>'+
                '</tr>';
            }

            return '<tbody>'+
                dataColl+
                '</tbody>'+
                '</table>';
        },
        sessionHeaders: function(){
            return '<table>'+
                '<thead>'+
                '<tr>'+
                '<td style="font-size: 13px;border-left: 1px solid black;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Date</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Time</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">User ID</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Subject</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Amount</td>'+
                '</tr>'+
                '</thead>'
        },
        sessionBody: function(data){

            var dataColl = '';
            for(var i = 0; i < data.length ; i++){
                dataColl += '<tr>'+
                '<td style="font-size: 8px;border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].dated +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].time +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].userId +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].message +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].amount +'</td>'+
                '</tr>';
            }

            return '<tbody>'+
                dataColl+
                '</tbody>'+
                '</table>';
        },
        userActivityHeaders: function(){
            return '<table>'+
                '<thead>'+
                '<tr>'+
                '<td style="font-size: 13px;border-left: 1px solid black;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Customer Name</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">User ID</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Created On</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Last Login</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Password Expires</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Invalid Login Attempts</td>'+
                '</tr>'+
                '</thead>';
        },
        userActivityBody: function(data){

            var dataColl = '';
            for(var i = 0; i < data.length ; i++){
                dataColl += '<tr>'+
                '<td style="font-size: 8px;border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].customerName +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].userId +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].createdOn +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].lastLogin +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].passwordExp +'</td>'+
                '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].attempts +'</td>'+
                '</tr>';
            }

            return '<tbody>'+
                dataColl+
                '</tbody>'+
                '</table>';
        },
        transactionHeaders: function(){
            return '<table border="1">'+
                '<thead>'+
                '<tr>'+
                '<td style="font-family: monospace;font-size: 16px;text-align: center;padding: 2px 5px;">Account Number</td>'+
                '<td style="font-family: monospace;font-size: 16px;text-align: center;padding: 2px 5px;">Posted</td>'+
                '<td style="font-family: monospace;font-size: 16px;text-align: center;padding: 2px 5px;">Description</td>'+
                '<td style="font-family: monospace;font-size: 16px;text-align: center;padding: 2px 5px;">Check</td>'+
                '<td style="font-family: monospace;font-size: 16px;text-align: center;padding: 2px 5px;">Transaction Amount</td>'+
                '</tr>'+
                '</thead>'
        },
        transactionBody: function(data){

            var dataColl = '';
            for(var i = 0; i < data.length ; i++){
                dataColl += '<tr>'+
                    '<td style="font-family: monospace;font-size: 13px;padding: 2px 5px;text-align: right;">'+ data[i].accountNo +'</td>'+
                    '<td style="font-family: monospace;font-size: 13px;padding: 2px 5px;">'+ data[i].posted +'</td>'+
                    '<td style="font-family: monospace;font-size: 13px;padding: 2px 5px;">'+ data[i].description +'</td>'+
                    '<td style="font-family: monospace;font-size: 13px;padding: 2px 5px;text-align: right;">'+ data[i].check +'</td>'+
                    '<td style="font-family: monospace;font-size: 13px;padding: 2px 5px;text-align: right;">'+ data[i].transactionAmt +'</td>'+
                    '</tr>';
            }

            return '<tbody>'+
                dataColl+
                '</tbody>'+
                '</table>';
        },
        emailFooter : function(){
            return '<br/><br/><p>Thanking you,</p>'+
                '<p>Yours Sincerely,</p>'+
                '<p style="font-weight: bold">'+ this.config.bankName +'</p>'+
                '<div>'+
                '<p><img style ="float: left" src="cid:imageEmailTemplateEnd"/>Important : '+ this.config.bankName +' will never send e-mails that ask for confidential information. If you receive an e-mail/call requesting your Internet Banking details like your PIN, password, account number, please do not respond. 	This is an automatically generated e-mail. Please do not reply back to this message.</p>'+
                '</div>'+
                '<br/>'+
                '<p><b>DISCLAIMER</b>:</p>'+
                '<p>The contents of this message and any attachments are confidential and are intended solely for the attention and use of the addressee only. Information contained in this message may be subject to legal, professional or other privilege or may otherwise be protected by other legal rules. This message should not be copied or forwarded to any other person without the express permission of the sender. If you are not the intended recipient you are not authorized to disclose, copy, distribute or retain this message or any part of it. If you have received this message in error, please notify the sender and destroy the original message. We reserve the right to monitor all e-mail messages passing through our network. To know more about our products, visit our website <a href="'+ this.config.bankSiteUrl +'">'+ this.config.bankSiteName +'</a> .<p>'
        },
        updateInfo: function(data){

            var newDated = new Date();
            var updateTemplate = '<p>Update personal info request details are given below.</p>'+
            '<p>Request Date & Time – '+ moment(newDated).format("dddd, MMMM D, YYYY h:mm:ss A") +'</p>'+
            '<p>Update personal Info Details</p>';

            if(data.AddressLine1 != '') updateTemplate = updateTemplate +'<p>Address Line 1 – '+ data.AddressLine1 +'</p>';
            if(data.AddressLine2 != '') updateTemplate = updateTemplate +'<p>Address Line 2 – '+ data.AddressLine2 +'</p>';
            if(data.city != '') updateTemplate = updateTemplate +'<p>City – '+ data.city +'</p>';
            if(data.state != '') updateTemplate = updateTemplate +'<p>State – '+ data.state +'</p>';
            if(data.zip != '') updateTemplate = updateTemplate +'<p>Zip Code – '+ data.zip +'</p>';
            if(data.country != '') updateTemplate = updateTemplate +'<p>Country – '+ data.country +'</p>';
            if(data.homePhone != '') updateTemplate = updateTemplate +'<p>Home Phone – '+ data.homePhone +'</p>';
            if(data.workPhone != '') updateTemplate = updateTemplate +'<p>Work Phone – '+ data.workPhone +'</p>';
            if(data.cellPhone != '') updateTemplate = updateTemplate +'<p>Cell Phone – '+ data.cellPhone +'</p>';
            if(data.emailId != '') updateTemplate = updateTemplate +'<p>E-Mail ID – '+ data.emailId +'</p>';

            return updateTemplate;
        },
        wireTransfer: function(data){

            var wireTemplate = '<p>Wire transfer request details are given below.</p>'+
                '<p>Request Date & Time – '+ moment(data.updatedOn).format("dddd, MMMM D, YYYY h:mm:ss A") +'</p>'+
                '<p>Sender Information</p>'+
                '<p>Account – '+ data.fromAccount+'</p>'+
                '<p>Amount - $ '+ data.amount +'</p>'+
                '<p>Beneficiary Information</p>'+
                '<p>Beneficiary Name – '+ data.beneficiary.beneficiaryName +'</p>'+
                '<p>Beneficiary Account – '+ data.beneficiary.recipientBankInfo.accountNo +'</p>';

            if(data.beneficiary.specialInstruction.instruction1) wireTemplate = wireTemplate + '<p>Special Instructions1 – '+ data.beneficiary.specialInstruction.instruction1 +'</p>';
            if(data.beneficiary.specialInstruction.instruction2) wireTemplate = wireTemplate + '<p>Special Instructions2 – '+ data.beneficiary.specialInstruction.instruction2 +'</p>';
            if(data.beneficiary.specialInstruction.instruction3) wireTemplate = wireTemplate + '<p>Special Instructions3 – '+ data.beneficiary.specialInstruction.instruction3 +'</p>';
            if(data.beneficiary.specialInstruction.instruction4) wireTemplate = wireTemplate + '<p>Special Instructions4 – '+ data.beneficiary.specialInstruction.instruction4 +'</p>';
            wireTemplate = wireTemplate + '<p>Beneficiary Bank Information</p>'+
            '<p>Beneficiary Bank Name – '+ data.beneficiary.recipientBankInfo.bankName +'</p>'+
            '<p>Beneficiary Bank Routing Number – '+ data.beneficiary.recipientBankInfo.bankRoutingNo +'</p>';

            if(data.beneficiary.intermediateBank.bankName || data.beneficiary.intermediateBank.bankRoutingNo) wireTemplate = wireTemplate + '<p>Intermediate Bank Information</p>';
            if(data.beneficiary.intermediateBank.bankName) wireTemplate = wireTemplate + '<p>Intermediate Bank Name – '+ data.beneficiary.intermediateBank.bankName +'</p>';
            if(data.beneficiary.intermediateBank.bankRoutingNo) wireTemplate = wireTemplate + '<p>Intermediate Bank Routing Number – '+ data.beneficiary.intermediateBank.bankRoutingNo +'</p>';

            wireTemplate = wireTemplate + '<p>Schedule Information</p>'+
            '<p>Schedule Date – '+ data.scheduledInfo.scheduledDate +'</p>'+
            '<p>Schedule Type – ' + data.scheduledInfo.scheduledType +'</p>';

            if(data.scheduledInfo.scheduledType == "Recurring") wireTemplate = wireTemplate + '<p>Frequency – '+ data.scheduledInfo.frequency +'</p>'+
            '<p>Expiration Date – '+ data.scheduledInfo.expiryDate +'</p>';

            return wireTemplate;
        },
        orderCheckBook: function(data){

            var newDated = new Date();
            var orderCheckTemplate = '<p>Check Order request details are given below.</p>'+
                '<p>Request Date & Time – '+ moment(data.updatedOn).format("dddd, MMMM D, YYYY h:mm:ss A") +'</p>'+
                '<p>Check Order details</p>'+
                '<p>Account – '+ data.accountNo +'</p>'+
                '<p>Starting Check Number – '+ data.startingCheckNo +'</p>'+
                '<p>Number of Boxes – '+ data.noOfBoxes +'</p>'+
                '<p>Design – '+ data.design +'</p>'+
                '<p>Style – '+ data.style +'</p>';

            if(data.comments) orderCheckTemplate = orderCheckTemplate + '<p>Comments – '+ data.comments +'</p>';

            return orderCheckTemplate;
        },
        resetPassword: function(data){
            return '<p>Dear '+ data.customerName +',</p><p>As per your request we have reset your password. Your new password is <b>'+ data.password +'</b> .For security reasons we recommend you not to share your password with anyone including bank staff. You are requested to change this password on login.</p><br/><p>Thanks & Regards,</p><p>Bank</p>';
        },
        resetSecurityQuestions: function(data){
            return '<p>Dear '+ data.customerName +',</p><p>As per your request we have reset your security questions. You are requested to change security questions on login.</p><br/><p>Thanks & Regards,</p><p>Bank</p>';
        },
        forgottenUserId: function(data){
            return '<p>Dear '+ data.customerName +',</p><p>As per your request we have retrieved your UserID. Your userID is <b>'+ data.userId +'</b> .For security reasons we recommend you not to share your userId with anyone including bank staff. </p><br/><p>Thanks & Regards,</p><p>Bank</p>';
        },
        reminderMail: function(data){
            return '<p>Dear '+ data.customerName +',</p><p>You have set a reminder. </p><p>'+ data.reminderMessage +'</p>'
        },
        otpAuthFactor: function(data){
            return '<p>One time password (OTP) for your transaction is ' + data.otp + ' . Bank never calls to verify your OTP. Do not disclose OTP to anyone.</p>';
        },
        bankMailFooter: function(){
            return '<br/><br/><p><b>IMPORTANT/CONFIDENTIAL</b>: This transmission is intended only for the use of the addressee(s) shown. It contains information that may be privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient of this transmission, you are hereby notified that the copying, use, or distribution of any information or materials transmitted herewith is strictly prohibited. If you have received this transmission by mistake, please contact sender immediately.</p>';
        },
        bankAdminPassword: function(data){
                return '<p>Your Admin Login Credentials</p><p>UserID: <b>' + data.userName +'</b></p><p>Password:  <b>'+ data.password +'</b></p><p> .For security reasons we recommend you not to share your password with anyone including bank staff. You are requested to change this password on login.</p><br/><p>Thanks & Regards,</p><p>Bank</p>';
        },
        userLoginPassword: function(data){
            return '<p>Dear '+ data.customerName+', </p>'+'<p>Your Login Password is <b>'+ data.password +'</b> .For security reasons we recommend you not to share your password with anyone including bank staff. You are requested to change this password on login.</p><br/><p>Thanks & Regards,</p><p>Bank</p>';
        },
        userLoginUserId: function(data){
            return '<p>Dear '+ data.customerName+', </p>'+'<p>Your Login userId is <b>' + data.userName +'</b> .For security reasons we recommend you not to share your userID with anyone including bank staff. </p><br/><p>Thanks & Regards,</p><p>Bank</p>';
        },
        alertLoginReset: function(data){
            return '<p>ALERT:  Your login which was locked due to invalid login attempts has been reset. Please try login with your User ID & Password.</p>'+
                    '<br/><p>For any issues please contact your bank.</p>'
                    /*'<br/><p>IMPORTANT/CONFIDENTIAL: This transmission is intended only for the use of the addressee(s) shown. It contains information that may be privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient of this transmission, you are hereby notified that the copying, use, or distribution of any information or materials transmitted herewith is strictly prohibited. If you have received this transmission by mistake, please contact sender immediately.</p>'*/;
        },
        alertLoginLimitExceeded: function(data){
            return '<p>ALERT:  Your login attempts have exceeded the daily limit and must be reset.  Please contact your bank.</p>'+
                '<br/><p>For any issues please contact your bank.</p>';
        },
        alertACHProcessed: function(data){
            return '<p>ALERT:  ACH batch ' + data.batchName + ' has been processed successfully for effective date '+ data.effectiveDate +'.</p>';
        },
        alertACHNotProcessed: function(data){
            return '<p>ALERT:  ACH batch ' + data.batchName + ' with effective date '+ data.effectiveDate +' has been declined.</p>';
        },
        alertACHImportProcessed: function(data){
            return '<p>ALERT:  ACH file '+ data.fileName +' with effective date '+ data.dated +' has been processed successfully.</p>';
        },
        alertACHImportNotProcessed: function(data){
            return '<p>ALERT:  ACH file '+ data.fileName +' with effective date '+ data.dated +' has been declined.</p>';
        },
        alertWireTransfer: function(data){
            return '<p>ALERT:  Wire transfer request for recipient '+ data.recipientName +' for amount $'+ data.amount +' scheduled for ' + data.dated + ' has been successfully processed.</p>';
        },
        changedFTL: function(data){
            return '<p>Dear '+ data.customerName+', </p>'+'<p>Your Internet Banking is activated with username <b>'+ data.userName +'</b> .</p><br/>';
        },
        changedPassword: function(data){
            return '<p>Dear '+ data.customerName+', </p>'+'<p>Your Login Password is changed. For security reasons we recommend you not to share your password with anyone including bank staff.</p><br/>';
        },
        customerOnboardingUserMail: function(data){
            return '<p>Dear '+ data.customerName+', </p>'+'<p>Your Login Username is <b>'+data.userName+'</b>. For security reasons we recommend you not to share your username with anyone including bank staff.</p><br/>';
        },
        customerOnboardingPasswordMail: function(data){
            return '<p>Dear '+ data.customerName+', </p>'+'<p>Your Login Password is <b>'+data.password+'</b>. For security reasons we recommend you not to share your password with anyone including bank staff.</p><br/>';
        }
    };

    module.exports = function(config , tnxId){
        return (new EmailTemplate(config , tnxId));
    };
})();