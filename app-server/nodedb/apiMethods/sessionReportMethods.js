(function(){

    var moment = require('moment');

    var downloader = require('./fileDownloadMethods');

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var SessionReport = function SessionReport(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.SessionReport;
    };

    SessionReport.prototype = {
        getSessionReport : function(reqBody , callback){
            this.callback = callback;
            var toDated = new Date(reqBody.toDate);
            var lessThan = toDated.getTime() + 60 * 60 * 1000 * 23.99;

            (reqBody.download == 'csv' || reqBody.download == 'tsv' || reqBody.download == 'pdf')? this.downloadFile = true : this.downloadFile = false;

            this.downloadMethod = downloader(this.config , reqBody.download , reqBody.listedUserId , this.tnxId);

            var routed = {
                institutionId       : this.config.instId,
                userId              : reqBody.listedUserId,
                moduleType          : {$in : reqBody.moduleType },
                $and                : [ { sessionReportDate: { $gte: new Date(reqBody.fromDate)} }, { sessionReportDate: { $lte: new Date(lessThan)} } ]
            };

            var fields = 'userName sessionReportDate transaction.message transaction.amount';

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId , fields);
            var resHandle = this.returnSessionReport.bind(this);
            mongo.FindMethod(resHandle);
        },
        returnSessionReport: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                if(this.downloadFile){
                    var jsonArray = [];
                    var headers = ['Date' , 'Time' , 'User' , 'Subject' , 'Amount'];
                    for(var i = 0 ; i < result.length; i++){
                        var jsonObj = {
                            dated       : moment(result[i].sessionReportDate).format('L'),
                            time        : moment(result[i].sessionReportDate).format('h:mm:ss a'),
                            userId      : result[i].userName,
                            message     : result[i].transaction.message,
                            amount      : result[i].transaction.amount
                        };

                        jsonArray.push(jsonObj);
                    }

                    this.downloadMethod.parseData(jsonArray , headers , this.callback , 'sessionReport');
                }else{
                    this.callback(null , result);
                }
            }
        }
    };

    module.exports = function(config, tnxId){
        return (new SessionReport(config, tnxId));
    };

    module.exports.addSessionReport = function addSessionReport(report){
        var moduleURL = {
            "/iris/login": "LOGIN",
            "/iris/first/change": "LOGIN",
            "/iris/create/batch": "TRANSFER",
            "/iris/create/recipient": "TRANSFER",
            "/iris/approve/batch": "TRANSFER",
            "/iris/decline/batch": "TRANSFER",
            "/iris/upload/ach": "TRANSFER",
            "/iris/ach/batch/process": "TRANSFER",
            "/iris/ach/batch/remove": "TRANSFER",
            "/iris/exclude/recipient": "TRANSFER",
            "/iris/include/recipient": "TRANSFER",
            "/iris/change/password": "CHANGE_PASSWORD",
            "/iris/change/security/question": "CHANGE_INFO",
            "/iris/change/personal/info": "CHANGE_INFO",
            "/iris/update/batch": "TRANSFER",
            "/iris/update/recipient": "TRANSFER",
            "/iris/remove/batch": "TRANSFER",
            "/iris/remove/recipient": "TRANSFER",
            "/iris/logout": "LOGOUT",
            "/iris/add/reminder": "REMINDER",
            "/iris/edit/reminder": "REMINDER",
            "/iris/delete/reminder": "REMINDER",
            "/iris/stop/payment": "STOP_PAYMENT",
            "/iris/add/alert": "ALERT",
            "/iris/delete/alert": "ALERT",
            "/iris/add/beneficiary": "TRANSFER",
            "/iris/edit/beneficiary": "TRANSFER",
            "/iris/delete/beneficiary": "TRANSFER",
            "/iris/add/wire/transfer": "TRANSFER",
            "/iris/authorize/wire/transfer": "TRANSFER",
            "/iris/delete/wire/transfer": "TRANSFER",
            "/iris/order/check": "ORDER_CHECK",
            "/iris/transaction/inquiry": "ACCOUNT_HISTORY",
            "/iris/show/policy": "PASSWORD_RULES",
            "/iris/reset/password": "RESET_PASSWORD",
            "/iris/reset/securityq": "RESET_SECURITY_QUESTIONS",
            "/iris/admin/reactivate/user": "REACTIVATE_USER",
            "/iris/question/change": "SECURITY",
            "/iris/mfa/question": "SECURITY",
            "/iris/verify/mfa": "SECURITY",
            "/iris/validate/otp": "SECURITY",
            "/iris/validate/forgot/password/otp": "SECURITY",
            "/iris/list/security/question": "SECURITY",
            "/iris/user/all/security/question": "SECURITY",
            "/iris/user/security/question": "SECURITY",
            "/iris/verify/emailId": "EMAIL",
            "/iris/verify/security/question": "SECURITY",
            "/iris/statements/enrollment": "STATEMENTS_ENROLLMENT",
            "/iris/view/enrollments": "STATEMENTS_ENROLLMENT",
            "/iris/list/stop/payment": "STOP_PAYMENT_LIST",
            "/iris/delete/stop/payment": "STOP_PAYMENT_LIST",
            "/iris/session/report": "REPORT",
            "/iris/session/report/download": "REPORT",
            "/iris/edit/alert": "ALERT",
            "/iris/list/alert": "ALERT",
            "/iris/deenroll/accountnumber": "STATEMENTS_ENROLLMENT",
            "/iris/list/reminder": "REMINDER",
            "/iris/send/mail": "EMAIL",
            "/iris/reply/message": "EMAIL",
            "/iris/mail/inbox": "EMAIL",
            "/iris/read/message": "EMAIL",
            "/iris/mail/sent": "EMAIL",
            "/iris/mail/trash": "TRASH",
            "/iris/trash/message": "TRASH",
            "/iris/delete/trash": "TRASH",
            "/iris/customer/inquiry": "CUSTOMER_INQUIRY",
            "/iris/account/inquiry": "ACCOUNT_HISTORY",
            "/iris/transaction/inquiry/download": "ACCOUNT_HISTORY",
            "/iris/funds/transfer": "TRANSFER",
            "/iris/pending/transfer": "TRANSFER",
            "/iris/delete/funds/transfer": "TRANSFER",
            "/iris/edit/funds/transfer": "TRANSFER",
            "/iris/payveris/session": "PAYVERIS",
            "/iris/list/batch": "BATCH",
            "/iris/process/batch": "BATCH",
            "/iris/reinitiate/batch": "BATCH",
            "/iris/list/pending/batch": "BATCH",
            "/iris/list/editable/batch": "BATCH",
            "/iris/batch/recipient": "BATCH",
            "/iris/routing/number": "BATCH",
            "/iris/ach/list": "ACH",
            "/iris/list/achbatch": "ACH",
            "/iris/list/beneficiary": "TRANSFER",
            "/iris/list/wire/transfer": "TRANSFER",
            "/iris/supervisor/list/user": "TRANSFER",
            "/iris/check/availability": "CHECK",
            "/iris/supervisor/add/user": "USER",
            "/iris/supervisor/unlock/user": "USER",
            "/iris/supervisor/delete/user": "USER",
            "/iris/supervisor/edit/account/access": "USER",
            "/iris/supervisor/edit/user/views": "USER",
            "/iris/supervisor/edit/limits": "USER",
            "/iris/supervisor/change/question": "USER",
            "/iris/bond/calculate": "CALCULATE",
            "/iris/statement/download": "STATEMENTS_ENROLLMENT",
            "/iris/check/image": "CHECK",
            "/iris/statement/file": "STATEMENTS_ENROLLMENT",
            "/iris/keep/alive": "USER",
            "/iris/add/user": "USER",
            "/iris/user/updatenickname": "USER",
            "/iris/add/thirdpartybeneficiary": "THIRD_PARTY_BENEFICIARY",
            "/iris/edit/thirdpartybeneficiary": "THIRD_PARTY_BENEFICIARY",
            "/iris/list/thirdpartybeneficiary": "THIRD_PARTY_BENEFICIARY",
            "/iris/delete/thirdpartybeneficiary": "THIRD_PARTY_BENEFICIARY",
            "/iris/deletePending/thirdpartybeneficiary": "THIRD_PARTY_BENEFICIARY",
            "/iris/supervisor/edit/profile": "USER",
            "/iris/generateCaptcha": "CAPTCHA",
            "/iris/file": "FILE",
            "/iris/capture/deposit/availablelimits": "CHECK",
            "/iris/capture/deposit/checks": "CHECK",
            "/iris/capture/deposit/transmit": "CHECK",
            "/iris/api/payveris/externaltransferservices/addexternalaccount": "PAYVERIS",
            "/iris/api/payveris/externaltransferservices/activateexternalaccount": "PAYVERIS",
            "/iris/api/payveris/externaltransferservices/deleteexternalaccount": "PAYVERIS",
            "/iris/api/payveris/externaltransferservices/gettransferhistory": "PAYVERIS",
            "/iris/api/payveris/ptoptransferservices/canceltransfer": "PAYVERIS",
            "/iris/api/payveris/externaltransferservices/scheduletransfer": "PAYVERIS",
            "/iris/api/payveris/externaltransferservices/getscheduledtransfers": "PAYVERIS",
            "/iris/api/payveris/externaltransferservices/getusertransferaccounts": "PAYVERIS",
            "/iris/api/payveris/ptoptransferservices/getusertransferaccounts": "PAYVERIS",
            "/iris/api/payveris/ptoptransferservices/getusertransferrecipients": "PAYVERIS",
            "/iris/api/payveris/ptoptransferservices/transfermoney": "PAYVERIS",
            "/iris/api/payveris/ptoptransferservices/gettransfers": "PAYVERIS",
            "/iris/api/payveris/externaltransferservices/getexternalaccounts": "PAYVERIS",
            "/iris/api/payveris/paymentservices/getdayspaymentsummary": "PAYVERIS",
            "/iris/api/payveris/paymentservices/getpaymenthistory": "PAYVERIS",
            "/iris/api/payveris/paymentservices/getscheduledpayments": "PAYVERIS",
            "/iris/api/payveris/paymentservices/getuserpaymentaccounts": "PAYVERIS",
            "/iris/api/payveris/paymentservices/scheduleexpeditedpayment": "PAYVERIS",
            "/iris/api/payveris/paymentservices/schedulepayment": "PAYVERIS",
            "/iris/api/payveris/ebillsservices/addebills": "PAYVERIS",
            "/iris/api/payveris/ebillsservices/providelogininformation": "PAYVERIS",
            "/iris/api/payveris/ebillsservices/selectebillsaccount": "PAYVERIS",
            "/iris/api/payveris/ebillsservices/getmanageebillsstatus": "PAYVERIS",
            "/iris/api/payveris/payeeservices/addpayee": "PAYVERIS",
            "/iris/api/payveris/payeeservices/getbillers": "PAYVERIS",
            "/iris/api/payveris/payeeservices/getebillstatement": "PAYVERIS",
            "/iris/api/payveris/payeeservices/getpayees": "PAYVERIS",
            "/iris/api/payveris/payeeservices/gettopbillers": "PAYVERIS",
            "/iris/api/payveris/payeeservices/searchbillers": "PAYVERIS",
            "/iris/api/payveris/payeeservices/updatepayee": "PAYVERIS",
            "/iris/api/payveris/payeeservices/validatebilleraccount": "PAYVERIS",
            "/iris/api/payveris/payeeservices/deletepayee": "PAYVERIS"
        };
        var activityURL = {
            "/iris/login": "Login",
            "/iris/first/change": "First Time Profile Update",
            "/iris/create/batch": "Create Batch",
            "/iris/create/recipient": "Create Recipient",
            "/iris/approve/batch": "Approve Batch",
            "/iris/decline/batch": "Decline Batch",
            "/iris/upload/ach": "Upload ACH",
            "/iris/ach/batch/process": "ACH Batch Process",
            "/iris/ach/batch/remove": "ACH Batch Remove",
            "/iris/exclude/recipient": "Exclude Recipient",
            "/iris/include/recipient": "Include Recipient",
            "/iris/change/password": "Change Password",
            "/iris/change/security/question": "Change Security Question",
            "/iris/change/personal/info": "View Personal Info",
            "/iris/update/batch": "Update Batch",
            "/iris/update/recipient": "Update Recipient",
            "/iris/remove/batch": "Remove Batch",
            "/iris/remove/recipient": "Remove Recipient",
            "/iris/logout": "Logout",
            "/iris/add/reminder": "Add Reminder",
            "/iris/edit/reminder": "Edit Reminder",
            "/iris/delete/reminder": "Delete Reminder",
            "/iris/stop/payment": "Stop Payment",
            "/iris/add/alert": "Add Alert",
            "/iris/delete/alert": "Delete Alert",
            "/iris/add/beneficiary": "Add Beneficiary",
            "/iris/edit/beneficiary": "Edit Beneficiary",
            "/iris/delete/beneficiary": "Delete Beneficiary",
            "/iris/add/wire/transfer": "Add Wire Transfer",
            "/iris/authorize/wire/transfer": "Authorize Wire Transfer",
            "/iris/delete/wire/transfer": "Delete Wire Transfer",
            "/iris/order/check": "Order Check",
            "/iris/transaction/inquiry": "Transaction Inquiry",
            "/iris/show/policy": "Admin Policy",
            "/iris/reset/password": "Reset Password",
            "/iris/reset/securityq": "Reset Security Questions",
            "/iris/admin/reactivate/user": "Reactivate User",
            "/iris/question/change": "Reset Security Questions",
            "/iris/mfa/question": "MFA",
            "/iris/verify/mfa": "MFA Verify",
            "/iris/validate/otp": "Validate OTP",
            "/iris/validate/forgot/password/otp": "Forgot Password OTP Verification",
            "/iris/list/security/question": "All Security Question List",
            "/iris/user/all/security/question": "User Security Question List",
            "/iris/user/security/question": "Forget Password Security Questions",
            "/iris/verify/emailId": "Verify Email",
            "/iris/verify/security/question": "Verify Security Question",
            "/iris/statements/enrollment": "Statements Enrollment",
            "/iris/view/enrollments": "View Enrollments",
            "/iris/list/stop/payment": "Stop Payment List",
            "/iris/delete/stop/payment": "Delete Stop Payment",
            "/iris/session/report": "Session Report",
            "/iris/session/report/download": "Download Session Report",
            "/iris/edit/alert": "Edit Alert",
            "/iris/list/alert": "Alert List",
            "/iris/deenroll/accountnumber": "De-Enroll Accountnumber",
            "/iris/list/reminder": "Reminder List",
            "/iris/send/mail": "Send Mail",
            "/iris/reply/message": "Reply Message",
            "/iris/mail/inbox": "Mail Inbox",
            "/iris/read/message": "Read Message",
            "/iris/mail/sent": "Sent Mail",
            "/iris/mail/trash": "Mail Trash",
            "/iris/trash/message": "Trash Message",
            "/iris/delete/trash": "Delete Trash",
            "/iris/customer/inquiry": "Customer Inquiry",
            "/iris/account/inquiry": "Account Inquiry",
            "/iris/transaction/inquiry/download": "Download Transaction Inquiry",
            "/iris/funds/transfer": "Funds Transfer",
            "/iris/pending/transfer": "Pending Transfer",
            "/iris/delete/funds/transfer": "Delete Funds Transfer",
            "/iris/edit/funds/transfer": "Edit Funds Transfer",
            "/iris/payveris/session": "Payveris Session",
            "/iris/list/batch": "Batch List",
            "/iris/process/batch": "Batch Process",
            "/iris/reinitiate/batch": "Batch Reinitialize",
            "/iris/list/pending/batch": "Batch Pending List",
            "/iris/list/editable/batch": "Batch List Edit",
            "/iris/batch/recipient": "Batch Recipient",
            "/iris/routing/number": "Routing Number",
            "/iris/ach/list": "ACH List",
            "/iris/list/achbatch": "ACH Batch List",
            "/iris/list/beneficiary": "Beneficiary List",
            "/iris/list/wire/transfer": "wire Transfer List",
            "/iris/supervisor/list/user": "Supervisor List",
            "/iris/check/availability": "Check Availability",
            "/iris/supervisor/add/user": "Add Supervisor",
            "/iris/supervisor/unlock/user": "Unlock Supervisor",
            "/iris/supervisor/delete/user": "Delete Supervisor",
            "/iris/supervisor/edit/account/access": "Edit Supervisor Account Access",
            "/iris/supervisor/edit/user/views": "Edit Supervisor Views",
            "/iris/supervisor/edit/limits": "Supervisor Edit Limits",
            "/iris/supervisor/change/question": "Supervisor Change Question",
            "/iris/bond/calculate": "Calculate",
            "/iris/statement/download": "Download Statement",
            "/iris/check/image": "Check Image",
            "/iris/statement/file": "File Stataement",
            "/iris/keep/alive": "Keep Alive",
            "/iris/add/user": "Add User",
            "/iris/user/updatenickname": "Update User Nickname",
            "/iris/add/thirdpartybeneficiary": "Add Third Party Benificiary",
            "/iris/edit/thirdpartybeneficiary": "Edit Third Party Benificiary",
            "/iris/list/thirdpartybeneficiary": "Third Party Benificiary List",
            "/iris/delete/thirdpartybeneficiary": "Delete Third Party Benificiary",
            "/iris/deletePending/thirdpartybeneficiary": "Delete Pending Third Party Benificiary",
            "/iris/supervisor/edit/profile": "Veiw Supervisor Profile",
            "/iris/generateCaptcha": "Captcha",
            "/iris/file": "File",
            "/iris/capture/deposit/availablelimits": "Deposit Available Limits",
            "/iris/capture/deposit/checks": "Deposit Checks",
            "/iris/capture/deposit/transmit": "Transmit Checks",
            "/iris/api/payveris/externaltransferservices/addexternalaccount": "Add External Account",
            "/iris/api/payveris/externaltransferservices/activateexternalaccount": "Activate External Account",
            "/iris/api/payveris/externaltransferservices/deleteexternalaccount": "Delete External Account",
            "/iris/api/payveris/externaltransferservices/gettransferhistory": "External Transfer History",
            "/iris/api/payveris/ptoptransferservices/canceltransfer": "Cancel Transfer",
            "/iris/api/payveris/externaltransferservices/scheduletransfer": "Schedule Transfer",
            "/iris/api/payveris/externaltransferservices/getscheduledtransfers": "External Scheduled Transfers",
            "/iris/api/payveris/externaltransferservices/getusertransferaccounts": "External User Transfer Accounts",
            "/iris/api/payveris/ptoptransferservices/getusertransferaccounts": "User Transfer Accounts",
            "/iris/api/payveris/ptoptransferservices/getusertransferrecipients": "User Transfer Recipients",
            "/iris/api/payveris/ptoptransferservices/transfermoney": "Transfer Money",
            "/iris/api/payveris/ptoptransferservices/gettransfers": "person To Person Transfers",
            "/iris/api/payveris/externaltransferservices/getexternalaccounts": "External Accounts",
            "/iris/api/payveris/paymentservices/getdayspaymentsummary": "Days Payment Summary",
            "/iris/api/payveris/paymentservices/getpaymenthistory": "Payment History",
            "/iris/api/payveris/paymentservices/getscheduledpayments": "Scheduled Payments",
            "/iris/api/payveris/paymentservices/getuserpaymentaccounts": "User Payment Accounts",
            "/iris/api/payveris/paymentservices/scheduleexpeditedpayment": "Schedule Expedited Payment",
            "/iris/api/payveris/paymentservices/schedulepayment": "Schedule Payment",
            "/iris/api/payveris/ebillsservices/addebills": "Add EBills",
            "/iris/api/payveris/ebillsservices/providelogininformation": "EBill Login Information",
            "/iris/api/payveris/ebillsservices/selectebillsaccount": "EBills Account",
            "/iris/api/payveris/ebillsservices/getmanageebillsstatus": "EBills Status",
            "/iris/api/payveris/payeeservices/addpayee": "Add Payee",
            "/iris/api/payveris/payeeservices/getbillers": "Payee Billers",
            "/iris/api/payveris/payeeservices/getebillstatement": "Payee EBill Statement",
            "/iris/api/payveris/payeeservices/getpayees": "Payees",
            "/iris/api/payveris/payeeservices/gettopbillers": "Top Billers",
            "/iris/api/payveris/payeeservices/searchbillers": "Billers Search",
            "/iris/api/payveris/payeeservices/updatepayee": "Update Payee",
            "/iris/api/payveris/payeeservices/validatebilleraccount": "Validate Biller Account",
            "/iris/api/payveris/payeeservices/deletepayee": "Delete Payee"
        };
        var amount = ' ';

        if(moduleURL[report.req.url]){

            if(moduleURL[report.req.url] == "STOP_PAYMENT" ){
                if(report.req.request.body.paymentType == "Check"){
                    if(report.req.request.body.checkInfo.amount.amountFrom == report.req.request.body.checkInfo.amount.amountTo){
                        amount = report.req.request.body.checkInfo.amount.amountFrom;
                    }else{
                        amount = 'From ' + report.req.request.body.checkInfo.amount.amountFrom + '- To ' + report.req.request.body.checkInfo.amount.amountTo;
                    }
                }else{
                    if(report.req.request.body.achInfo.amount.amountFrom == report.req.request.body.achInfo.amount.amountTo){
                        amount = report.req.request.body.achInfo.amount.amountFrom;
                    }else{
                        amount = 'From ' + report.req.request.body.achInfo.amount.amountFrom + '- To ' + report.req.request.body.achInfo.amount.amountTo;
                    }
                }
            }

            if(activityURL[report.req.url] == "Funds Transfer"){
                amount = report.req.request.body.creditTo.transactionAmount.amount;
            }

            if(report.req.url == "/iris/add/wire/transfer"){
                amount =  report.req.request.body.amount;
            }

            var routed = {
                institutionId           : report.req.config.instId,
                userId                  : report.req.request.body.userId,
                userName                : report.req.request.body.userSelectedName || report.req.request.body.userName,
                transactionId           : report.req.request.headers['x-request-id'] ? report.req.request.headers['x-request-id'] : "",
                moduleType              : moduleURL[report.req.url],
                activityType            : activityURL[report.req.url],
                transaction             : {
                    url                     : report.url,
                    request                 : report.req.request.body,
                    ipAddress               : report.ip,
                    message                 : report.message,
                    nextStep                : report.nextStep,
                    amount                  : amount
                },
                sessionReportDate       : new Date()
            };

            var model = mongoModelName.modelName.SessionReport;
            var util = utils.util();
            var mongo = util.initMongo(model ,routed , 'SessionReport');
            mongo.Save();
        }
    };
})();