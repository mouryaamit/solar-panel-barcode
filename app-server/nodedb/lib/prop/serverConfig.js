(function () {

    var configFile = function configFile(fileName){
        //Return Object
        this.JSONObj = {};
        this.fileName = fileName;

        this.populate = function(){
            if(!this.fileName){
                this.fileName = 'iris';
            }

            var config = require('../config/'+this.fileName);

            config.serviceTo = this.fileName;
            config.mongoDb = {
                dbName              : 'iris',
                dbPath              : 'mongodb://192.168.2.220:27017/iris-mfa/'
            };
            config.enrollStatusMsg = {
                approved                    : 'Approved',
                awaited                     : 'Pending',
                rejected                    : 'Rejected'
            };
            config.contentFiles = './public/contentfiles/';
            config.emailTemplate = {
                tnxDetail                   : 'transaction',
                approved                    : 'approved',
                rejected                    : 'rejected',
                loginOtp                    : 'loginOtp',
                lockedUser                  : 'lockedUser',
                otp                         : 'otp',
                pdf                         : 'pdf',
                chequeBook                  : 'chequeBook',
                multipleCheque              : 'multipleCheque',
                singleCheque                : 'singleCheque',
                forgotReset                 : 'forgotReset',
                changePassword              : 'changePassword',
                forgotUserId                : 'forgotUserId'
            };
            config.nextStepTo = {
                goToAccountOverview         : 'nextAccOverview',
                goToNextAccountOverview     : 'accOverview',
                goToFirstTimeLogin          : 'firstTimeLogin',
                goToMFA                     : 'mfa',
                goToChangePassword          : 'changePassword',
                goToChangeSecurityQuestion  : 'changeSecurityQuestion',
                goToAchBatchSummary         : 'achBatchSummary',
                goToAchBatchAuthorization   : 'achBatchAuthorization',
                goToListBeneficiary         : 'listRegisteredBeneficiary',
                goToListThirdPartyBeneficiary: 'listRegisteredBeneficiaryPandT',
                goToFundsTransfer           : 'fundsTransfer',
                goToCheckThirdPartyBeneficiaryName: 'checkThirdPartyBeneficiaryName',
                goToConfirmDialog: 'confirmDialog',
                goToDeletePendingTransfer: 'deletePendingTransfer',
                goToWireTransferSuccess     : 'wireTransferRequestSuccess',
                goToOrderCheck              : 'orderChecks',
                goToStopPaymentList         : 'stopPaymentList',
                goToStatement               : 'statements',
                doNothing                   : 'doNothing',
                goToForgotPassword          : 'forgotPassword',
                goToOTP                     : 'otp',
                goToLogin                   : 'login',
                goToLogout                  : 'logout',
                goToAddNewSecurityQ        : 'addNewSecurityQ'
            };
            config.tags = {
                MongoConnection             : 'MongoConnection',
                MongoBefore                 : 'MongoBefore',
                MongoAfter                  : 'MongoAfter',
                Core                        : 'Core',
                Request                     : 'Request'
            };
            config.status = {
                NotEnrolled                 : "Not Enrolled",
                Verified                    : "Verified",
                Locked                      : "Locked",
                Scheduled                   : "scheduled",
                Rejected                    : "rejected",
                Deleted                     : "deleted",
                Pending                     : "pending",
                Excluded                    : "excluded",
                Included                    : "included",
                Recurring                   : "Recurring"
            };

            this.JSONObj = config;
            return true;
        };

        //Function For Config Retrieval
        this.getConfig = function () {
            return this.JSONObj;
        };
    };

    module.exports = function(fileName){
        return (new configFile(fileName));
    };
})();