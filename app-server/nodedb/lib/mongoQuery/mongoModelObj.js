(function(){

    var _ = require('underscore');

    var BankAdminModel = require('../models/dbModel').BankAdmin;
    var BankPasswordRuleModel = require('../models/dbModel').BankPasswordRule;
    var AccessTypeModel = require('../models/dbModel').AccessType;
    var PasswordHistoryModel = require('../models/dbModel').PasswordHistory;
    var AdminPasswordHistoryModel = require('../models/dbModel').AdminPasswordHistory;
    var ACHRoutingInfoModel = require('../models/dbModel').ACHRoutingInfo;
    var FedRoutingInfoModel = require('../models/dbModel').FedRoutingInfo;
    var ACHRoutingNoModel = require('../models/dbModel').ACHRoutingNo;
    var FedRoutingNoModel = require('../models/dbModel').FedRoutingNo;
    var BatchModel = require('../models/dbModel').Batch;
    var BatchRecipientModel = require('../models/dbModel').BatchRecipient;
    var UploadedFileModel = require('../models/dbModel').FileUploaded;
    var FileBatchModel = require('../models/dbModel').FileBatch;
    var UserModel = require('../models/dbModel').User;
    var StatementsEnrollmentModel = require('../models/dbModel').StatementsEnrollment;

    var DeletedUserModel = require('../models/dbModel').DeletedUser;
    var LockUserModel = require('../models/dbModel').LockUser;
    var WireTransferModel = require('../models/dbModel').WireTransfer;
    var BeneficiaryModel = require('../models/dbModel').Beneficiary;
    var ThirdPartyBeneficiaryModel = require('../models/dbModel').ThirdPartyBeneficiary;
    var BankPolicyRestrictionModel = require('../models/dbModel').BankPolicyRestriction;
    var ReminderModel = require('../models/dbModel').Reminder;
    var AlertModel = require('../models/dbModel').Alert;
    var StopPaymentModel = require('../models/dbModel').StopPayment;
    var SessionReportModel = require('../models/dbModel').SessionReport;
    var InValidLoginModel = require('../models/dbModel').InValidLogin;
    var TransactionLimitModel = require('../models/dbModel').TransactionLimit;
    var BankMailModel = require('../models/dbModel').BankMail;
    var UserPageHitModel = require('../models/dbModel').UserPageHit;
    var TotalPageHitModel = require('../models/dbModel').TotalPageHit;
    var UserSessionModel = require('../models/dbModel').UserSession;
    var SiteImagesModel = require('../models/dbModel').SiteImages;
    var SiteSelectedImagesModel = require('../models/dbModel').SiteSelectedImages;
    var MailWordingModel = require('../models/dbModel').MailWording;
    var MultiLingualModel = require('../models/dbModel').MultiLingual;
    var SessionOtpModel = require('../models/dbModel').SessionOtp;
    var ForgotPasswordOtpModel = require('../models/dbModel').ForgotPasswordOtp;
    var OtpConfigurationModel = require('../models/dbModel').OtpConfiguration;
    var MenuHelpMapperModel = require('../models/dbModel').MenuHelpMapper;
    var LimitProfileModel = require('../models/dbModel').LimitProfile;
    var BankConfigModel = require('../models/dbModel').BankConfig;
    var FundsTransferLogModel = require('../models/dbModel').FundsTransferLog;
    var FundsTransferLogsAckModel = require('../models/dbModel').FundsTransferLogsAck;
    var FundsTransferStatusLogModel = require('../models/dbModel').FundsTransferStatusLog;
    var TransferInstructionModel = require('../models/dbModel').TransferInstruction;
    var barcodeModel = require('../models/dbModel').barcode;

    exports.modelName = {
        BankAdmin                               : 'BankAdmin',
        BankMail                                : 'BankMail',
        InValidLogin                            : 'InValidLogin',
        StopPayment                             : 'StopPayment',
        SessionReport                           : 'SessionReport',
        Reminder                                : 'Reminder',
        AccessType                              : 'AccessType',
        Alert                                   : 'Alert',
        User                                    : 'User',
        StatementsEnrollment                    : 'StatementsEnrollment',
        DeletedUser                             : 'DeletedUser',
        Batch                                   : 'Batch',
        BatchRecipient                          : 'BatchRecipient',
        ACHRoutingNo                            : 'ACHRoutingNo',
        FedRoutingNo                            : 'FedRoutingNo',
        PasswordHistory                         : 'PasswordHistory',
        AdminPasswordHistory                    : 'AdminPasswordHistory',
        FedRoutingInfo                          : 'FedRoutingInfo',
        ACHRoutingInfo                          : 'ACHRoutingInfo',
        FileBatch                               : 'FileBatch',
        LockUser                                : 'LockUser',
        WireTransfer                            : 'WireTransfer',
        Beneficiary                             : 'Beneficiary',
        ThirdPartyBeneficiary                   : 'ThirdPartyBeneficiary',
        BankPolicyRestriction                   : 'BankPolicyRestriction',
        BankPasswordRule                        : 'BankPasswordRule',
        TransactionLimit                        : 'TransactionLimit',
        UserPageHit                             : 'UserPageHit',
        TotalPageHit                            : 'TotalPageHit',
        UserSession                             : 'UserSession',
        SiteImages                              : 'SiteImages',
        SiteSelectedImages                      : 'SiteSelectedImages',
        MailWording                             : 'MailWording',
        MultiLingual                            : 'MultiLingual',
        SessionOtp                              : 'SessionOtp',
        ForgotPasswordOtp                       : 'ForgotPasswordOtp',
        OtpConfiguration                        : 'OtpConfiguration',
        FileUpload                              : 'FileUpload',
        MenuHelpMapper                          : 'MenuHelpMapper',
        BankConfig                              : 'BankConfig',
        LimitProfile                            : 'LimitProfile',
        FundsTransferLog                        : 'FundsTransferLog',
        FundsTransferLogsAck                        : 'FundsTransferLogsAck',
        FundsTransferStatusLog               : 'FundsTransferStatusLog',
        Captcha                                 : 'Captcha',
        barcode                         : 'barcode',
        TransferInstruction                     : 'TransferInstruction'
    };

    var mongoModels = [
        {
            model               : 'BankAdmin',
            modelObj            : BankAdminModel
        },
        {
            model               : 'UserPageHit',
            modelObj            : UserPageHitModel
        },
        {
            model               : 'TotalPageHit',
            modelObj            : TotalPageHitModel
        },
        {
            model               : 'BankMail',
            modelObj            : BankMailModel
        },
        {
            model               : 'AccessType',
            modelObj            : AccessTypeModel
        },
        {
            model               : 'InValidLogin',
            modelObj            : InValidLoginModel
        },
        {
            model               : 'User',
            modelObj            : UserModel
        },
        {
            model               : 'StatementsEnrollment',
            modelObj            : StatementsEnrollmentModel
        },
        {
            model               : 'DeletedUser',
            modelObj            : DeletedUserModel
        },
        {
            model               : 'ACHRoutingNo',
            modelObj            : ACHRoutingNoModel
        },
        {
            model               : 'FedRoutingNo',
            modelObj            : FedRoutingNoModel
        },
        {
            model               : 'PasswordHistory',
            modelObj            : PasswordHistoryModel
        },
        {
            model               : 'AdminPasswordHistory',
            modelObj            : AdminPasswordHistoryModel
        },
        {
            model               : 'BatchRecipient',
            modelObj            : BatchRecipientModel
        },
        {
            model               : 'Batch',
            modelObj            : BatchModel
        },
        {
            model               : 'FedRoutingInfo',
            modelObj            : FedRoutingInfoModel
        },
        {
            model               : 'ACHRoutingInfo',
            modelObj            : ACHRoutingInfoModel
        },
        {
            model               : 'FileBatch',
            modelObj            : FileBatchModel
        },
        {
            model               : 'FileUpload',
            modelObj            : UploadedFileModel
        },
        {
            model               : 'LockUser',
            modelObj            : LockUserModel
        },
        {
            model               : 'WireTransfer',
            modelObj            : WireTransferModel
        },
        {
            model               : 'Beneficiary',
            modelObj            : BeneficiaryModel
        },
        {
            model               : 'ThirdPartyBeneficiary',
            modelObj            : ThirdPartyBeneficiaryModel
        },
        {
            model               : 'BankPolicyRestriction',
            modelObj            : BankPolicyRestrictionModel
        },
        {
            model               : 'BankPasswordRule',
            modelObj            : BankPasswordRuleModel
        },
        {
            model               : 'TransactionLimit',
            modelObj            : TransactionLimitModel
        },
        {
            model               : 'Alert',
            modelObj            : AlertModel
        },
        {
            model               : 'StopPayment',
            modelObj            : StopPaymentModel
        },
        {
            model               : 'SessionReport',
            modelObj            : SessionReportModel
        },
        {
            model               : 'UserSession',
            modelObj            : UserSessionModel
        },
        {
            model               : 'Reminder',
            modelObj            : ReminderModel
        },
        {
            model               : 'SiteImages',
            modelObj            : SiteImagesModel
        },
        {
            model               : 'MailWording',
            modelObj            : MailWordingModel
        },
        {
            model               : 'MultiLingual',
            modelObj            : MultiLingualModel
        },
        {
            model               : 'SessionOtp',
            modelObj            : SessionOtpModel
        },
        {
            model               : 'ForgotPasswordOtp',
            modelObj            : ForgotPasswordOtpModel
        },
        {
            model               : 'OtpConfiguration',
            modelObj            : OtpConfigurationModel
        },
        {
            model               : 'SiteSelectedImages',
            modelObj            : SiteSelectedImagesModel
        },
        {
            model               : 'LimitProfile',
            modelObj            : LimitProfileModel
        },
        {
            model               : 'MenuHelpMapper',
            modelObj            : MenuHelpMapperModel
        },
        {
            model               : 'BankConfig',
            modelObj            : BankConfigModel
        },
        {
            model               : 'FundsTransferLog',
            modelObj            : FundsTransferLogModel
        },
        {
            model               : 'FundsTransferLogsAck',
            modelObj            : FundsTransferLogsAckModel
        },
        {
            model               : 'FundsTransferStatusLog',
            modelObj            : FundsTransferStatusLogModel
        },
        {
            model               : 'TransferInstruction',
            modelObj            : TransferInstructionModel
        },
        {
            model               : 'barcode',
            modelObj            : barcodeModel
        }
    ];


    exports.getModelByModelName = function(collName){

        return(_.findWhere(mongoModels, {model: collName}));
    };
})();