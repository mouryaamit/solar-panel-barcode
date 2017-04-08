(function(){

    var paperwork = require('../utils/paperwork');

    module.exports.validate = {
        DefaultTemplate : {},
        DefaultTestTemplate : {
            userId : paperwork.optional(String),
            accountNumber : paperwork.optional(String)
        },
        // Validator for Account Data Refresh
        AccountData : {
            customerId                  : String
        },
        MiniDownloadTemplate:{
            userId                      : String,
            accountNumber               : String,
            downloadType                : String
        },
        SummaryDownloadTemplate:{
            userId                      : String,
            dateFrom                    : String,
            dateTo                      : String,
            accountNumber               : String,
            downloadType                : String,
            accountType                 : String,
            accountDetails              : String
        },
        StatementTemplate:{
            userId                      : String,
            accountNumber               : String
        },
        AccountSummaryTemplate:{
            userId                      : String,
            dateFrom                    : String,
            dateTo                      : String,
            accountNumber               : String
        },
        AdminTemplate: {
            firstName                   : String,
            lastName                    : String,
            emailId                     : String,
            password                    : String,
            phoneNo                     : String
        },
        AdminAuthTemplate: {
            emailId                     : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            password                    : String
        },
        IsValidCustomerTemplate : {
            customerId                  : String,
            reCaptchaChallenge          : String,
            reCaptchaResponse           : String
        },
        /*LoginAuthTemplate :{
         emailId                     : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         password                    : String
         },*/
        LoginAuthTemplate :{
            userId                      : String,
            password                    : String
        },
        LogoutTemplate :{
            userId                      : String
        },
        otpTemplate :{
            userId                      : String,
            otp                         : String
        },
        changePasswordTemplate :{
            userId                      : String,
            password                    : String,
            newPassword                 : String
        },
        CustomerEnrollTemplate :{
            customerId                  : String,
            password                    : String,
            customerName                : String,
            accountNumber               : String,
            mobileNumber                : String,
            emailId                     : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            dateOfBirth                 : String,
            secretQtn                   : paperwork.optional(String),
            secretAns                   : paperwork.optional(String)
        },
        ApprovedTemplate :{
            userId                      : String
        },
        RejectTemplate :{
            userId                      : String,
            reason                      : String
        },
        UnlockTemplate :{
            userId                      : String
        },
        SecretValidateTemplate :{
            userId                      : String,
            secretQuestion              : String,
            secretAnswer                : String,
            dateOfBirth                 : String
        },
        RequestChequeTemplate :{
            userId                      : String,
            accountNumber               : String
        },
        RequestChequeOtpTemplate :{
            userId                      : String,
            otp                         : String
        },
        StopChequeTemplate : {
            userId                      : String,
            accountNumber               : String,
            chequeNumberFrom            : String,
            chequeNumberTo              : String,
            remarks                     : String
        },
        StopChequeOtpTemplate : {
            userId                      : String,
            otp                         : String
        },
        AwaitedListTemplate :{
            toDate                      : String,
            fromDate                    : String
        },
        IsValidUserTemplate : {
            userId                      : String,
            reCaptchaChallenge          : String,
            reCaptchaResponse           : String
        },
        ResendOtpTemplate : {
            userId                      : String
        },
        RetrieveUserIdTemplate : {
            reCaptchaChallenge          : String,
            reCaptchaResponse           : String,
            accountNumber               : String,
            mobileNumber                : String,
            emailId                     : String
        },
        RetrieveUserIdOtpTemplate : {
            userId                      : String,
            otp                         : String
        }
    };

})();