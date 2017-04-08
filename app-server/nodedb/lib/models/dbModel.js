(function () {
    <!--##################################Require the Modules########################################################-->

    module.exports.modelForService = function (service) {

        var dbConn = require('../prop/globalConnObj');

        var db = dbConn.getdbConn(service);

        var mongoose = dbConn.getConnMongoose(service),
            Schema = mongoose.Schema;

        var timestamps = require('../utils/timestamp');


        <!--##################################Bank Admin Schema######################################################-->
        <!--#########################################################################################################-->
        var BankAdmin = new Schema({
            institutionId: {type: String, required: true},
            name: {type: String, required: true},
            adminId: {type: String, required: true},
            emailId: {type: String, required: true},
            userName: {type: String, required: true},
            password: {type: String, required: true},
            status: {type: String, required: true, default: 'Not Enrolled'},
            phoneNo: {type: String},
            invalidLoginCount: {type: Number},
            passwordExp: {type: Date},
            viewAccess: {
                FiSecurityOptions: {

                    ChangePassword: {type: Boolean, default: false},
                    BankPassword: {type: Boolean, default: false},
                    UserSecurity: {type: Boolean, default: false},
                    GroupMail: {type: Boolean, default: false}
                },
                CustomerSupport: {
                    CustomerOnboarding: {
                        BranchOnboarding: {type: Boolean, default: false}
                    },
                    CustomerLoginMaintenance: {type: Boolean, default: false},
                    AccountExclusion: {type: Boolean, default: false},
                    BankMail: {type: Boolean, default: false},
                    MailWording: {type: Boolean, default: false},
                    DeleteCustomer: {type: Boolean, default: false},
                    UserActivityReport: {type: Boolean, default: false},
                    FindUserDetail: {type: Boolean, default: false}
                },
                FiPolicies: {
                    AccessType: {type: Boolean, default: false},
                    CustomerUserIdPassword: {type: Boolean, default: false},
                    OtpConfiguration: {type: Boolean, default: false},
                    LimitProfile: {type: Boolean, default: false},
                    // users:{type: Boolean, default : false },
                    MultiLingual: {type: Boolean, default: false},
                    Site: {type: Boolean, default: false}
                },
                FileProcessing: {
                    ExtractDownload: {type: Boolean, default: false}
                },
                Reports: {
                    DowntimeReport: {type: Boolean, default: false},
                    InactivityReport: {type: Boolean, default: false},
                    InvalidLoginAttemptsReport: {type: Boolean, default: false},
                    CustomerWisePageHits: {type: Boolean, default: false},
                    PageHitsReport: {type: Boolean, default: false},
                    FundTransferReport: {type: Boolean, default: false},
                    ReconciliationReport: {type: Boolean, default: false}

                }
            },
            securityQuestion: [{
                questionId: {type: String},
                answer: {type: String}
            }],
            lastLogin: {type: Date, default: new Date()},
            lastLoginIP: {type: String},
            firstLogin: {type: Boolean, default: true},
            lastLoginIPCollection: [{type: String}]
        });

        BankAdmin.plugin(timestamps);
        BankAdmin.index({institutionId: 1, userName: 1}, {unique: true});

        module.exports.BankAdmin = db.model('bankadmin', BankAdmin);

        <!--##################################Bank Password Rules Schema#############################################-->
        <!--#########################################################################################################-->
        var BankPasswordRule = new Schema({
            institutionId: {type: String, required: true},
            passwordRule: {type: String, default: 'bankPasswordRule'},
            minimumNumericChars: {type: String},
            minimumUpperCaseChars: {type: String},
            minimumLowerCaseChars: {type: String},
            minimumSpecialChars: {type: String},
            minimumLength: {type: String},
            checkLastPassword: {type: String},
            restrictUserIdInPassword: {type: Boolean},
            restrictNameInPassword: {type: Boolean},
            restrictPasswordKeywords: {type: Boolean},
            failedLoginAttempts: {type: String},
            isUserNameCaseSensitive: {type: Boolean, default: true},
            passwordExpirationInfo: {
                numberOfDaysPasswordExpire: {type: String},
                numberOfDaysPasswordLock: {type: String},
                expiryWarningAfter: {type: String}
            },
            passwordKeywords: []
        });

        BankPasswordRule.plugin(timestamps);
        BankPasswordRule.index({institutionId: 1, passwordRule: 1}, {unique: true});

        module.exports.BankPasswordRule = db.model('bankpasswordrule', BankPasswordRule);

        <!--##################################AccessType Schema######################################################-->
        <!--#########################################################################################################-->
        var AccessType = new Schema({
            institutionId: {type: String, required: true},
            accessType: {type: String, required: true},
            limitProfile: {type: Schema.ObjectId, ref: 'LimitProfile', required: true},
            privilege: {
                userViews: {
                    "UserType": {type: String, required: true, default: "Personal"},
                    "Accounts": {
                        "Overview": {type: Boolean, default: true},
                        "DetailsHistory": {type: Boolean, default: true},
                        "Statements": {type: Boolean, default: false},
                        "StatementsEnrollment": {type: Boolean, default: false}
                    },
                    "CheckDeposit": {
                        "Deposit": {type: Boolean, default: false},
                        "DepositHistory": {type: Boolean, default: false}
                    },
                    "Payments": {
                        "BillPay": {type: Boolean, default: false},
                        "PendingTransfer": {type: Boolean, default: false},
                        "FundsTransfer": {type: Boolean, default: false},
                        "TransferMoneyAtOtherFI": {type: Boolean, default: false},
                        "PayOtherPeople": {type: Boolean, default: false},
                        "ThirdPartyTransfer": {type: Boolean, default: false}
                    },
                    "PaymentsWireTransfer": {
                        "WireTransferAuthorization": {type: Boolean, default: false},
                        "WireTransferHistory": {type: Boolean, default: false},
                        "WireTransferRequest": {type: Boolean, default: false},
                        "ListBeneficiary": {type: Boolean, default: false},
                        "RegisterBeneficiary": {type: Boolean, default: false}
                    },
                    "PaymentsThirdPartyTransfer": {
                        "ListThirdPartyBeneficiary": {type: Boolean, default: false},
                        "RegisterThirdPartyBeneficiary": {type: Boolean, default: false}
                    },
                    "BusinessServicesACH": {
                        "ACHFileImportAuthorization": {type: Boolean, default: false},
                        "ACHFileImport": {type: Boolean, default: false},
                        "ACHBatchAuthorization": {type: Boolean, default: false},
                        "ACHRecipients": {type: Boolean, default: false},
                        "ACHAddNewRecipients": {type: Boolean, default: false},
                        "CreateNewBatch": {type: Boolean, default: false},
                        "ACHBatchSummary": {type: Boolean, default: false}
                    },
                    "BusinessServicesWireTransfer": {
                        "WireTransferAuthorization": {type: Boolean, default: false},
                        "WireTransferHistory": {type: Boolean, default: false},
                        "WireTransferRequest": {type: Boolean, default: false},
                        "ListBeneficiary": {type: Boolean, default: false},
                        "RegisterBeneficiary": {type: Boolean, default: false}
                    },
                    "BusinessServices": {
                        "BusinessFundsTransfer": {type: Boolean, default: false},
                        "BusinessThirdPartyTransfer": {type: Boolean, default: false},
                        "PositivePay": {type: Boolean, default: false},
                        "BillPay": {type: Boolean, default: false}
                    },
                    "OtherServices": {
                        "OrderChecks": {type: Boolean, default: false},
                        "Alerts": {type: Boolean, default: false},
                        "StopPayments": {type: Boolean, default: false},
                        "BankMail": {type: Boolean, default: false}
                    },
                    "ProfileManagement": {
                        "ChangePassword": {type: Boolean, default: false},
                        "ChangeSecurityQuestion": {type: Boolean, default: false},
                        "ViewPersonalInfo": {type: Boolean, default: false},
                        "Reminders": {type: Boolean, default: false}
                    },
                    "AdministrativeTools": {
                        "SessionsReport": {type: Boolean, default: false},
                    },
                    "AdministrativeToolsUserManagement": {
                        "CreateNewUsers": {type: Boolean, default: false},
                        "Users": {type: Boolean, default: false}
                    },
                    "Calculators": {
                        "Bond": {type: Boolean, default: false},
                        "Retirement": {type: Boolean, default: false},
                        "Savings": {type: Boolean, default: false},
                        "Loan": {type: Boolean, default: false}
                    }
                }
            }
        });

        AccessType.plugin(timestamps);
        AccessType.index({institutionId: 1, accessType: 1}, {unique: true});

        module.exports.AccessType = db.model('accesstype', AccessType);
        /*limits                              : {
         achLimits                               : {
         achCreditLimitPerTranc                  : {type: String },
         achCreditLimitPerDay                    : {type: String },
         achDebitLimitPerTranc                   : {type: String },
         achDebitLimitPerDay                     : {type: String },
         restrictEdit                            : {type: Boolean , default  : false }
         },
         fundsLimits                             : {
         fundsLimitPerTranc                      : {type: String },
         fundsLimitPerDay                        : {type: String },
         restrictEdit                            : {type: Boolean , default  : false }
         },
         wireLimits                              : {
         wireLimitPerTranc                       : {type: String },
         wireLimitPerDay                         : {type: String },
         restrictEdit                            : {type: Boolean , default  : false }
         }
         }*/
        <!--##################################ChannelUser Schema#####################################################-->
        <!--#########################################################################################################-->
        var User = new Schema({
            institutionId: {type: String, required: true},
            userId: {type: String, required: true},
            customerId: {type: String, required: true},
            customerName: {type: String, default: ''},
            userName: {type: String, required: true},
            emailId: {type: String, required: true},
            password: {type: String},
            tempPassword: {type: String},
            changePasswordOnNextLogin: {type: Boolean, default: false},
            passwordChangedOn: {type: Date, default: new Date()},
            contact: {
                mobileNo: {type: String},
                phoneNo: {type: String}
            },
            customerType: {type: String, required: true},
            accessType: {type: String},
            limitsAvailable: {
                fundsPerDayLimit: {type: Boolean, default: false},
                fundsPerTrancLimit: {type: Boolean, default: false},
                achCreditPerDayLimit: {type: Boolean, default: false},
                achCreditPerTrancLimit: {type: Boolean, default: false},
                achDebitPerDayLimit: {type: Boolean, default: false},
                achDebitPerTrancLimit: {type: Boolean, default: false},
                wirePerDayLimit: {type: Boolean, default: false},
                wirePerTrancLimit: {type: Boolean, default: false}
            },
            privilege: {
                userViews: {
                    "UserType": {type: String, required: true, default: "Personal"},
                    "Accounts": {
                        "Overview": {type: Boolean, default: true},
                        "DetailsHistory": {type: Boolean, default: true},
                        "Statements": {type: Boolean, default: false},
                        "StatementsEnrollment": {type: Boolean, default: false}
                    },
                    "CheckDeposit": {
                        "Deposit": {type: Boolean, default: false},
                        "DepositHistory": {type: Boolean, default: false}
                    },
                    "Payments": {
                        "BillPay": {type: Boolean, default: false},
                        "PendingTransfer": {type: Boolean, default: false},
                        "FundsTransfer": {type: Boolean, default: false},
                        "TransferMoneyAtOtherFI": {type: Boolean, default: false},
                        "ThirdPartyTransfer": {type: Boolean, default: false},
                        "PayOtherPeople": {type: Boolean, default: false}
                    },
                    "PaymentsWireTransfer": {
                        "WireTransferAuthorization": {type: Boolean, default: false},
                        "WireTransferHistory": {type: Boolean, default: false},
                        "WireTransferRequest": {type: Boolean, default: false},
                        "ListBeneficiary": {type: Boolean, default: false},
                        "RegisterBeneficiary": {type: Boolean, default: false}
                    },
                    "BusinessServicesACH": {
                        "ACHFileImportAuthorization": {type: Boolean, default: false},
                        "ACHFileImport": {type: Boolean, default: false},
                        "ACHBatchAuthorization": {type: Boolean, default: false},
                        "ACHRecipients": {type: Boolean, default: false},
                        "ACHAddNewRecipients": {type: Boolean, default: false},
                        "CreateNewBatch": {type: Boolean, default: false},
                        "ACHBatchSummary": {type: Boolean, default: false}
                    },
                    "BusinessServicesWireTransfer": {
                        "WireTransferAuthorization": {type: Boolean, default: false},
                        "WireTransferHistory": {type: Boolean, default: false},
                        "WireTransferRequest": {type: Boolean, default: false},
                        "ListBeneficiary": {type: Boolean, default: false},
                        "RegisterBeneficiary": {type: Boolean, default: false}
                    },
                    "BusinessServices": {
                        "BusinessFundsTransfer": {type: Boolean, default: false},
                        "BusinessThirdPartyTransfer": {type: Boolean, default: false},
                        "PositivePay": {type: Boolean, default: false},
                        "BillPay": {type: Boolean, default: false}
                    },
                    "OtherServices": {
                        "OrderChecks": {type: Boolean, default: false},
                        "Alerts": {type: Boolean, default: false},
                        "BankMail": {type: Boolean, default: false},
                        "StopPayments": {type: Boolean, default: false}
                    },
                    "ProfileManagement": {
                        "ChangePassword": {type: Boolean, default: false},
                        "ChangeSecurityQuestion": {type: Boolean, default: false},
                        "ViewPersonalInfo": {type: Boolean, default: false},
                        "Reminders": {type: Boolean, default: false},
                        "StatementsEnrollment": {type: Boolean, default: false},
                        "viewEnrollments": {type: Boolean, default: false}
                    },
                    "AdministrativeTools": {
                        "SessionsReport": {type: Boolean, default: false},
                    },
                    "AdministrativeToolsUserManagement": {
                        "CreateNewUsers": {type: Boolean, default: false},
                        "Users": {type: Boolean, default: false}
                    },
                    "Calculators": {
                        "Bond": {type: Boolean, default: false},
                        "Retirement": {type: Boolean, default: false},
                        "Savings": {type: Boolean, default: false},
                        "Loan": {type: Boolean, default: false}
                    }
                },
                access: {
                    accountsAccess: [{
                        accountNo: {type: String},
                        accountType: {type: String},
                        bankId: {type: String},
                        branchName: {type: String}
                    }],
                    accountsTransferAccess: [{
                        accountNo: {type: String},
                        accountType: {type: String},
                        bankId: {type: String},
                        branchName: {type: String}
                    }],
                    accountsWireAccess: [{
                        accountNo: {type: String},
                        accountType: {type: String},
                        bankId: {type: String},
                        branchName: {type: String}
                    }],
                    accountsACHAccess: [{
                        accountNo: {type: String},
                        accountType: {type: String},
                        bankId: {type: String},
                        branchName: {type: String}
                    }],
                    accountsEStatementsAccess: [{
                        accountNo: {type: String},
                        accountType: {type: String},
                        bankId: {type: String},
                        branchName: {type: String}
                    }]
                },
                limits: {
                    achLimits: {
                        achCreditLimitPerTranc: {type: String},
                        achCreditLimitPerDay: {type: String},
                        achDebitLimitPerTranc: {type: String},
                        achDebitLimitPerDay: {type: String},
                        restrictEdit: {type: Boolean, default: false}
                    },
                    fundsLimits: {
                        fundsLimitPerTranc: {type: String},
                        fundsLimitPerDay: {type: String},
                        restrictEdit: {type: Boolean, default: false}
                    },
                    wireLimits: {
                        wireLimitPerTranc: {type: String},
                        wireLimitPerDay: {type: String},
                        restrictEdit: {type: Boolean, default: false}
                    }
                }
            },
            defaultScreen: {type: String},
            securityQuestion: [{
                questionId: {type: String},
                answer: {type: String}
            }],
            firstLogin: {type: Boolean, default: true},
            isSupervisor: {type: Boolean, default: false},
            lastLogin: {type: Date, default: new Date()},
            lastLoginIP: {type: String},
            lastLoginIPCollection: [{type: String}],
            lastLoginXFactorCollection: [{type: String}],
            status: {type: String, default: 'Not Enrolled'},
            createdBy: {type: String, default: 'System', required: true},
            originator: {type: String, default: 'System', required: true},
            accountsInformation: [{
                accountNo: {type: String},
                nickName: {type: String}
            }],
            excludedAccounts: [{
                accountNo: {type: String},
                productName: {type: String},
                accountType: {type: String}
            }],
            limitProfile: {type: Schema.ObjectId, ref: 'LimitProfile', default: null},
            isLimitProfileOverridden: {type: Boolean, default: false},
            isTemporaryPassword: {type: Boolean}
        });

        User.plugin(timestamps);
        User.index({institutionId: 1, userName: 1}, {unique: true});
        User.index({institutionId: 1, userId: 1}, {unique: true});

        module.exports.User = db.model('user', User);

        <!--##################################TransactionLimit Schema################################################-->
        <!--#########################################################################################################-->

        var TransactionLimit = new Schema({
            institutionId: {type: String},
            userId: {type: String},
            transactionType: {type: String},
            transactionAmount: {type: Number},
            transactionDated: {type: String}
        });

        TransactionLimit.plugin(timestamps);

        module.exports.TransactionLimit = db.model('transactionlimit', TransactionLimit);

        <!--##################################Beneficiary Schema#####################################################-->
        <!--#########################################################################################################-->

        var Beneficiary = new Schema({
            institutionId: {type: String},
            beneficiaryId: {type: String},
            userId: {type: String},
            beneficiaryName: {type: String},
            addressLine1: {type: String},
            addressLine2: {type: String},
            city: {type: String},
            state: {type: String},
            zip: {type: String},
            country: {type: String},
            specialInstruction: {
                instruction1: {type: String},
                instruction2: {type: String},
                instruction3: {type: String},
                instruction4: {type: String}
            },
            recipientBankInfo: {
                accountNo: {type: String},
                bankRoutingNo: {type: String},
                bankName: {type: String},
                specialInstruction: {
                    instruction1: {type: String},
                    instruction2: {type: String}
                }
            },
            intermediateBank: {
                bankRoutingNo: {type: String},
                bankName: {type: String}
            }
        });

        Beneficiary.plugin(timestamps);

        module.exports.Beneficiary = db.model('benefactor', Beneficiary);

        <!--##################################Third Party Beneficiary Schema#####################################################-->
        <!--#########################################################################################################-->

        var ThirdPartyBeneficiary = new Schema({
            institutionId: {type: String},
            thirdPartyBeneficiaryId: {type: String},
            userId: {type: String},
            beneficiaryName: {type: String},
            accountType: {type: String},
            customerId: {type: String},
            recipientBankAcc: {type: String}


        });

        ThirdPartyBeneficiary.plugin(timestamps);
        ThirdPartyBeneficiary.index({institutionId: 1, userId: 1, recipientBankAcc: 1}, {unique: true});

        module.exports.ThirdPartyBeneficiary = db.model('thirdpartybenefactor', ThirdPartyBeneficiary);
        <!--##################################WireTransfer Schema####################################################-->
        <!--#########################################################################################################-->

        var WireTransfer = new Schema({
            institutionId: {type: String, required:true},
            wireTransferId: {type: String, required:true},
            beneficiaryId: {type: String},
            transactionId: {type: String},
            userId: {type: String, required:true},
            authorizedBy : {type: String},
            authorizedAt : {type: Date},
            customersId: {type: String, required:true},
            userName: {type: String},
            fromAccount: {type: String},
            fromAccountType: {type: String},
            amount: {type: Number},
            beneficiary: {
                beneficiaryId: {type: String},
                userId: {type: String},
                beneficiaryName: {type: String},
                addressLine1: {type: String},
                addressLine2: {type: String},
                city: {type: String},
                state: {type: String},
                zip: {type: String},
                country: {type: String},
                specialInstruction: {},
                recipientBankInfo: {},
                intermediateBank: {},
                status: {type: String}
            },
            scheduledInfo: {
                scheduledDate: {type: String},
                scheduledType: {type: String},
                frequency: {type: String},
                expiryDate: {type: String}
            },
            recurringNextDate: {type: Date},
            recurringSchldDate: {type: Date},
            status: {type: String, default: 'pending'}
        });

        WireTransfer.plugin(timestamps);
        WireTransfer.index({institutionId: 1, wireTransferId: 1, userId:1}, {unique: true});
        WireTransfer.index({institutionId: 1, userId:1});
        WireTransfer.index({institutionId: 1, customersId: 1});

        module.exports.WireTransfer = db.model('wiretransfer', WireTransfer);

        <!--##################################InValid Login Schema###################################################-->
        <!--#########################################################################################################-->
        var InValidLogin = new Schema({
            institutionId: {type: String},
            recordDate: {type: Date},
            customerType: {type: String},
            userId: {type: String},
            isValidUserId: {type: String},
            ipAddress: {type: String}
        });

        InValidLogin.plugin(timestamps);

        module.exports.InValidLogin = db.model('invalidlogin', InValidLogin);

        <!--##################################Statements Enrollment Schema###################################################-->
        <!--#########################################################################################################-->
        var StatementsEnrollment = new Schema({
            institutionId: {type: String},
            userId: {type: String},
            accountNumbers: [
                {
                    createdOn: {type: Date},
                    accountNumber: {type: String}
                }
            ]
        });

        StatementsEnrollment.plugin(timestamps);

        module.exports.StatementsEnrollment = db.model('statementsEnrollment', StatementsEnrollment);

        <!--##################################Password History Schema################################################-->
        <!--#########################################################################################################-->
        var PasswordHistory = new Schema({
            institutionId: {type: String},
            userId: {type: String, required: true},
            passwordRec: [{
                changedAt: {type: Date},
                password: {type: String}
            }]
        });

        PasswordHistory.plugin(timestamps);
        PasswordHistory.index({institutionId: 1, userId: 1}, {unique: true});

        module.exports.PasswordHistory = db.model('passwordrec', PasswordHistory);


        <!--##################################Admin Password History Schema################################################-->
        <!--#########################################################################################################-->
        var AdminPasswordHistory = new Schema({
            institutionId: {type: String},
            adminId: {type: String, required: true},
            passwordRec: [{
                changedAt: {type: Date},
                password: {type: String}
            }]
        });

        AdminPasswordHistory.plugin(timestamps);
        AdminPasswordHistory.index({institutionId: 1, adminId: 1}, {unique: true});

        module.exports.AdminPasswordHistory = db.model('adminpasswordrec', AdminPasswordHistory);


        <!--##################################Batch Schema###########################################################-->
        <!--#########################################################################################################-->
        var Batch = new Schema({
            institutionId: {type: String},
            userId: {type: String},
            batchId: {type: String, required: true},
            batchCoreId: {type: String},
            batchName: {type: String},
            secCode: {type: String},
            accountNo: {type: String},
            companyName: {type: String},
            companyDiscretionaryData: {type: String},
            companyId: {type: String},
            companyDescription: {type: String},
            batchDescription: {type: String},
            scheduleType: {type: String, default: 'OneTime'},
            dateScheduled: {type: String},
            dateNextScheduled: {type: String},
            dateLastProcessed: {type: String},
            frequency: {type: String},
            dateScheduledProcess: {type: String},
            expirationDate: {type: String},
            effectiveDate: {type: String},
            status: {type: String, default: 'pending'}
        });

        Batch.plugin(timestamps);
        Batch.index({institutionId: 1, batchId: 1}, {unique: true});

        module.exports.Batch = db.model('batch', Batch);

        <!--##################################Batch Schema###########################################################-->
        <!--#########################################################################################################-->
        var BatchRecipient = new Schema({
            institutionId: {type: String},
            batchId: {type: String},
            instructionId: {type: String, default: ''},
            recipientName: {type: String},
            recipientId: {type: String, required: true},
            identity: {type: String},
            accountNo: {type: String},
            routingNumber: {type: String},
            amount: {type: Number},
            transactionCode: {type: String},
            expirationDate: {type: String},
            addenda: {type: String},
            status: {type: String, default: 'included'}
        });

        BatchRecipient.plugin(timestamps);

        module.exports.BatchRecipient = db.model('batchrecipient', BatchRecipient);

        <!--##################################Batch Schema########################################################@##-->
        <!--#########################################################################################################-->
        var FileUploaded = new Schema({
            institutionId: {type: String},
            fileId: {type: String},
            fileName: {type: String},
            uploadedBy: {type: String, default: 'admin'},
            uploadedById: {type: String},
            size: {type: String},
            path: {type: String},
            name: {type: String},
            extension: {type: String},
            type: {type: String}
        });

        FileUploaded.plugin(timestamps);

        module.exports.FileUploaded = db.model('fileupload', FileUploaded);

        <!--##################################Batch Schema###########################################################-->
        <!--#########################################################################################################-->
        var FileBatch = new Schema({
            institutionId: {type: String},
            fileId: {type: String},
            batchId: {type: String, required: true},
            batchName: {type: String},
            secCode: {type: String},
            accountNo: {type: String},
            companyName: {type: String},
            companyDiscretionaryData: {type: String},
            companyId: {type: String},
            companyDescription: {type: String},
            batchDescription: {type: String},
            dateScheduled: {type: String},
            frequency: {type: String},
            dateScheduledProcess: {type: String},
            expirationDate: {type: String},
            effectiveDate: {type: String},
            recipients: [{
                batchId: {type: String},
                recipientName: {type: String},
                recipientId: {type: String},
                identity: {type: String},
                accountNo: {type: String},
                routingNumber: {type: String},
                amount: {type: Number},
                transactionCode: {type: String},
                expirationDate: {type: String},
                addenda: {type: String}
            }]
        });

        FileBatch.plugin(timestamps);

        module.exports.FileBatch = db.model('filebatch', FileBatch);

        <!--##################################LockUser Schema########################################################-->
        <!--#########################################################################################################-->
        var LockUser = new Schema({
            institutionId: {type: String},
            lockedDate: {type: Date},
            userId: {type: String, index: true},
            userName: {type: String},
            counter: {type: Number},
            reason: {
                status: {type: Number},
                responseData: {
                    message: {type: String}
                }
            },
            lockedTimes: {type: Number}
        });

        LockUser.plugin(timestamps);

        module.exports.LockUser = db.model('lockuser', LockUser);

        <!--##################################Password Policy Schema#################################################-->
        <!--#########################################################################################################-->
        var BankPolicyRestriction = new Schema({
            institutionId: {type: String},
            bankPolicy: {type: String, default: 'bankPolicy'},
            userIdRestrictions: {
                minimumNumericChars: {type: String},
                minimumAlphaChars: {type: String},
                minimumSpecialChars: {type: String},
                minimumLength: {type: String}
            },
            passwordRestrictions: {
                minimumNumericChars: {type: String},
                minimumUpperCaseChars: {type: String},
                minimumLowerCaseChars: {type: String},
                minimumSpecialChars: {type: String},
                failedLoginAttempts: {type: String},
                minimumLength: {type: String}
            },
            passwordExpiration: {type: Boolean},

            passwordExpirationInfo: {
                numberOfDaysPasswordExpire: {type: String},
                numberOfDaysPasswordLock: {type: String},
                expiryWarningAfter: {type: String}
            },
            checkLastPassword: {type: Boolean},
            checkLastPasswordInfo: {
                numberOfPasswordCheck: {type: String}
            },
            restrictNameInPassword: {type: Boolean},
            restrictUserIdInPassword: {type: Boolean},
            restrictPasswordKeywords: {type: Boolean},
            passwordKeywords: [],
            authRestrictions: {
                isUserNameCaseSensitive: {type: Boolean},
                isSecurityAnswerCaseSensitive: {type: Boolean}
            }
        });

        BankPolicyRestriction.plugin(timestamps);
        BankPolicyRestriction.index({institutionId: 1, bankPolicy: 1}, {unique: true});

        module.exports.BankPolicyRestriction = db.model('bankrestrict', BankPolicyRestriction);

        <!--##################################Reminder Schema########################################################-->
        <!--#########################################################################################################-->
        var Reminder = new Schema({
            institutionId: {type: String},
            userId: {type: String},
            reminderId: {type: String},
            reminderDate: {type: Date},
            schedule: {type: String},
            showNextAt: {type: Date},
            reminderMessage: {type: String}
        });

        Reminder.plugin(timestamps);

        module.exports.Reminder = db.model('reminder', Reminder);

        <!--##################################Alert Schema###########################################################-->
        <!--#########################################################################################################-->
        var Alert = new Schema({
            institutionId: {type: String},
            userId: {type: String},
            alertId: {type: String},
            alertCoreId: {type: String},
            module: {type: String},
            accountInfo: {
                accountNo: {type: String},
                amount: {type: Number},
                checkNo: {
                    checkFrom: {type: String},
                    checkTo: {type: String}
                }
            },
            alertMessage: {type: String},
            alertTime: {
                alertFrom: {type: String},
                alertTo: {type: String}
            },
            alertThroughEmail: {type: Boolean},
            alertThroughPhone: {type: Boolean}
        });

        Alert.plugin(timestamps);

        module.exports.Alert = db.model('alert', Alert);

        <!--##################################Stop Payment Schema####################################################-->
        <!--#########################################################################################################-->
        var StopPayment = new Schema({
            institutionId: {type: String},
            userId: {type: String},
            stopPaymentId: {type: String},
            instructionId: {type: String},
            accountNo: {type: String},
            paymentType: {type: String},
            transaction: {type: String},
            expirationDate: {type: Date},
            checkInfo: {
                checkNumber: {
                    checkNoFrom: {type: String},
                    checkNoTo: {type: String}
                },
                amount: {
                    amountFrom: {type: Number},
                    amountTo: {type: Number}
                }
            },
            achInfo: {
                amount: {
                    amountFrom: {type: Number},
                    amountTo: {type: Number}
                }
            },
            reason: {type: String},
            comments: {type: String, default: ''},
            payee: {type: String, default: ''},
            status: {type: String}
        });

        StopPayment.plugin(timestamps);

        module.exports.StopPayment = db.model('stoppayment', StopPayment);

        <!--##################################Session Report Schema##################################################-->
        <!--#########################################################################################################-->
        var SessionReport = new Schema({
            institutionId: {type: String},
            userId: {type: String},
            userName: {type: String},
            moduleType: {type: String},
            transactionId: {type: String},
            activityType: {type: String},
            transaction: {},
            sessionReportDate: {type: Date}
        });

        SessionReport.plugin(timestamps);

        module.exports.SessionReport = db.model('sessionsreport', SessionReport);

        <!--##################################DownTimeCurrent Schema#################################################-->
        <!--#########################################################################################################-->
        var CurrentDownTime = new Schema({
            currentHistory: {type: String, default: 'Current'},
            startTime: {type: Date, default: new Date()},
            endTime: {type: Date, default: new Date()},
            serverName: {type: String},
            serviceName: {type: String},
            port: {type: String}
        });

        CurrentDownTime.plugin(timestamps);

        module.exports.CurrentDownTime = db.model('currentdowntime', CurrentDownTime);

        <!--##################################DownTimeHistory Report Schema##########################################-->
        <!--#########################################################################################################-->
        var DownTimeHistory = new Schema({
            dated: {type: Date},
            startTime: {type: Date},
            endTime: {type: Date},
            description: {type: String},
            downTime: {type: String},
            serverName: {type: String},
            serviceName: {type: String},
            port: {type: String}
        });

        DownTimeHistory.plugin(timestamps);

        module.exports.DownTimeHistory = db.model('downtime', DownTimeHistory);

        <!--##################################BankMailInbox Schema###################################################-->
        <!--#########################################################################################################-->
        var BankMail = new Schema({
            institutionId: {type: String},
            sendFrom: {type: String},
            sendTo: {type: String},
            userId: {type: String},
            senderName: {type: String},
            receiverName: {type: String},
            messageId: {type: String},
            message: {type: String},
            messageType: {type: String, default: 'Bank Mail'},
            subject: {type: String},
            isUserMessageDeleted: {type: Boolean, default: false},
            isAdminMessageDeleted: {type: Boolean, default: false},
            isUserMessageTrash: {type: Boolean, default: false},
            isAdminMessageTrash: {type: Boolean, default: false},
            isUserRead: {type: Boolean, default: false},
            isAdminRead: {type: Boolean, default: false},
            isReply: {type: Boolean, default: false},
            isAdminReply: {type: Boolean, default: false},
            isUserReply: {type: Boolean, default: false},
            isAttachment: {type: Boolean},
            attachments: [{
                path: {type: String},
                fileName: {type: String},
                fileSize: {type: String}
            }],
            reply: [{
                replyDated: {type: Date},
                replyId: {type: String},
                message: {type: String},
                senderName: {type: String},
                receiverName: {type: String},
                subject: {type: String},
                isAttachment: {type: Boolean},
                attachments: [{
                    path: {type: String},
                    fileName: {type: String},
                    fileSize: {type: String}
                }]
            }]
        });

        BankMail.plugin(timestamps);

        module.exports.BankMail = db.model('bankmail', BankMail);

        <!--##################################UserPageHits Schema####################################################-->
        <!--#########################################################################################################-->
        var UserPageHit = new Schema({
            institutionId: {type: String},
            currentDate: {type: Date},
            userId: {type: String},
            userName: {type: String},
            customerName: {type: String},
            section: {type: String},
            pageName: {type: String},
            visitCounter: {type: Number}
        });

        UserPageHit.plugin(timestamps);

        module.exports.UserPageHit = db.model('userpagehit', UserPageHit);

        <!--##################################UserPageHits Schema####################################################-->
        <!--#########################################################################################################-->
        var TotalPageHit = new Schema({
            institutionId: {type: String},
            currentDate: {type: Date},
            section: {type: String},
            pageName: {type: String},
            visitCounter: {type: Number},
            userCounter: {type: Number},
            userUniqueId: []
        });

        TotalPageHit.plugin(timestamps);

        module.exports.TotalPageHit = db.model('totalpagehit', TotalPageHit);

        <!--##################################MailWording Schema#####################################################-->
        <!--#########################################################################################################-->
        var MailWording = new Schema({
            institutionId: {type: String},
            mailType: {type: String},
            subject: {type: String},
            messageContent: {type: String}
        });

        MailWording.plugin(timestamps);
        MailWording.index({institutionId: 1, mailType: 1}, {unique: true});

        module.exports.MailWording = db.model('mailword', MailWording);

        <!--##################################Session Schema#########################################################-->
        <!--#########################################################################################################-->
        var UserSession = new Schema({
            sessionId: {type: String},
            sessionAt: {type: Date},
            sessionEndTime: {type: Number}
        });

        UserSession.plugin(timestamps);

        module.exports.UserSession = db.model('usersession', UserSession);

        <!--##################################RoutingNo Schema#######################################################-->
        <!--#########################################################################################################-->
        var ACHRoutingNo = new Schema({
            routingNo: {type: String}
        });

        ACHRoutingNo.plugin(timestamps);
        ACHRoutingNo.index({routingNo: 1}, {unique: true});

        module.exports.ACHRoutingNo = db.model('achroutingno', ACHRoutingNo);

        var FedRoutingNo = new Schema({
            routingNo: {type: String}
        });

        FedRoutingNo.plugin(timestamps);
        FedRoutingNo.index({routingNo: 1}, {unique: true});

        module.exports.FedRoutingNo = db.model('fedroutingno', FedRoutingNo);

        <!--##################################RoutingInfo Schema#####################################################-->
        <!--#########################################################################################################-->
        var ACHRoutingInfo = new Schema({
            scKey: {type: String},
            stateCode: {type: String},
            city: {type: String},
            banks: {
                type: [{
                    "routingNumber": {type: String, required: true},
                    "officeCode": {type: String},
                    "servicingFRBNumber": {type: String, required: true},
                    "recordTypeCode": {type: String},
                    "changeDate": {type: String},
                    "newRoutingNumber": {type: String},
                    "bankName": {type: String, required: true},
                    "address": {type: String},
                    "city": {type: String},
                    "stateCode": {type: String},
                    "zipcode": {type: String},
                    "zipcodeExtension": {type: String},
                    "telephoneAreaCode": {type: String},
                    "telephonePrefixNumber": {type: String},
                    "telephoneSuffixNumber": {type: String},
                    "institutionStatusCode": {type: String},
                    "dataViewCode": {type: String}
                }]
            }
        });

        ACHRoutingInfo.plugin(timestamps);

        module.exports.ACHRoutingInfo = db.model('achroutinginfo', ACHRoutingInfo);

        var FedRoutingInfo = new Schema({
            scKey: {type: String},
            stateCode: {type: String},
            city: {type: String},
            banks: {
                type: [
                    {
                        routingNumber: {type: String, required: true},
                        telegraphicName: {type: String},
                        bankName: {type: String, required: true},
                        address: {type: String},
                        city: {type: String},
                        stateCode: {type: String},
                        fundsTransferStatus: {type: String},
                        fundsSettlementOnlyStatus: {type: String},
                        bookEntrySecuritiesTransferStatus: {type: String},
                        dateOfLastRevision: {type: String}
                    }
                ]
            }
        });

        FedRoutingInfo.plugin(timestamps);

        module.exports.FedRoutingInfo = db.model('fedroutinginfo', FedRoutingInfo);


        <!--##################################Site Customisation Schema##############################################-->
        <!--#########################################################################################################-->
        var SiteImages = new Schema({
            institutionId: {type: String},
            imageId: {type: String},
            moduleType: {type: String},
            base64String: {type: String},
            fileName: {type: String},
            fileSize: {type: String},
            fileDimension: {type: String},
            fileType: {type: String}
        });

        SiteImages.plugin(timestamps);
        SiteImages.index({institutionId: 1, imageId: 1}, {unique: true});

        module.exports.SiteImages = db.model('siteimage', SiteImages);

        <!--##################################Site Selection Schema##################################################-->
        <!--#########################################################################################################-->
        var SiteSelectedImages = new Schema({
            institutionId: {type: String},
            imageId: {type: String},
            moduleType: {type: String}
        });

        SiteSelectedImages.plugin(timestamps);
        SiteSelectedImages.index({institutionId: 1, imageId: 1}, {unique: true});

        module.exports.SiteSelectedImages = db.model('siteselectedimage', SiteSelectedImages);

        <!--##################################Multiligual Schema#####################################################-->
        <!--#########################################################################################################-->
        var MultiLingual = new Schema({
            institutionId: {type: String, unique: true},
            languageSelected: {type: [], default: ['English']}
        });

        MultiLingual.plugin(timestamps);

        module.exports.MultiLingual = db.model('multilingual', MultiLingual);

        <!--##################################Session OTP Schema#####################################################-->
        <!--#########################################################################################################-->
        var SessionOtp = new Schema({
            institutionId: {type: String},
            otp: {type: String},
            otpForService: {type: String},
            sessionId: {type: String},
            sendThroughEmail: {type: Boolean},
            sendThroughSms: {type: Boolean},
            requestData: {}
        });

        SessionOtp.plugin(timestamps);

        module.exports.SessionOtp = db.model('sessionotp', SessionOtp);

        <!--##################################Session OTP Schema#####################################################-->
        <!--#########################################################################################################-->
        var ForgotPasswordOtp = new Schema({
            institutionId: {type: String},
            otp: {type: String},
            otpForService: {type: String},
            userId: {type: String},
            sendThroughEmail: {type: Boolean},
            sendThroughSms: {type: Boolean},
            requestData: {}
        });

        ForgotPasswordOtp.plugin(timestamps);

        module.exports.ForgotPasswordOtp = db.model('forgotpassotp', ForgotPasswordOtp);

        <!--##################################OtpConfiguration Schema################################################-->
        <!--#########################################################################################################-->
        var OtpConfiguration = new Schema({
            institutionId: {type: String, unique: true, required: true},
            forgotPassword: {type: Boolean},
            firstLogin: {type: Boolean},
            multiFactorAuthentication: {type: Boolean},
            statements: {type: Boolean},
            wireTransferNewBeneficiary: {type: Boolean},
            wireTransferNewRequest: {type: Boolean},
            achNewBatch: {type: Boolean},
            achBatchAuthorization: {type: Boolean},
            orderChecks: {type: Boolean},
            stopPayment: {type: Boolean},
            changePassword: {type: Boolean},
            changeSecurityQuestion: {type: Boolean},
            sendThroughEmail: {type: Boolean},
            sendThroughPhone: {type: Boolean},
            fundsTransfer: {type: Boolean}
        });

        OtpConfiguration.plugin(timestamps);

        module.exports.OtpConfiguration = db.model('otpconfig', OtpConfiguration);

        <!--##################################Bank Admin Schema######################################################-->
        <!--#########################################################################################################-->
        var LimitProfile = new Schema({
            institutionId: {type: Number, required: true},
            name: {type: String, required: true},
            transferLimitPerTransaction: {type: Number, required: true, default: 0},
            transferLimitPerDay: {type: Number, required: true, default: 0},
            wireTransferLimitPerTransaction: {type: Number, required: true, default: 0},
            wireTransferLimitPerDay: {type: Number, required: true, default: 0},
            ACHDebitLimitPerTransaction: {type: Number, required: true, default: 0},
            ACHDebitLimitPerDay: {type: Number, required: true, default: 0},
            ACHCreditLimitPerTransaction: {type: Number, required: true, default: 0},
            ACHCreditLimitPerDay: {type: Number, required: true, default: 0},
            createdBy: {type: String, required: true},
            lastModifiedBy: {type: String}
        });

        LimitProfile.plugin(timestamps);
        LimitProfile.index({institutionId: 1, name: 1}, {unique: true});

        module.exports.LimitProfile = db.model('limitprofile', LimitProfile);


        <!--################################## Menu Help Mapper Schema ##############################################-->
        <!--#########################################################################################################-->
        var MenuHelpMapper = new Schema({
            institutionId: {type: String, required: true},
            menuLink: {type: String, required: true},
            type: {type: String, required: true},
            helpLink: {type: String, required: true},
            geo: {type: String, required: true}
        });

        MenuHelpMapper.plugin(timestamps);
        MenuHelpMapper.index({institutionId: 1, menuLink: 1, type: 1}, {unique: true});

        module.exports.MenuHelpMapper = db.model('menuhelpmapper', MenuHelpMapper);


        <!--################################## Bank Config Schema ##############################################-->
        <!--#########################################################################################################-->
        var BankConfig = new Schema({
            institutionId: {type: String, required: true},
            encryptionKey: {type: String, required: true},
            siteCustomisedOn: {type: Date}
        });

        BankConfig.plugin(timestamps);
        BankConfig.index({institutionId: 1}, {unique: true});

        module.exports.BankConfig = db.model('bankconfig', BankConfig);

        <!--################################## Captcha Schema ##############################################-->
        <!--#########################################################################################################-->
        var Captcha = new Schema({
            captcha: {type: String, required: true},
            uuid: {type: String, required: true}
        });

        Captcha.plugin(timestamps);
        Captcha.index({captcha: 1, uuid: 1}, {unique: true});

        module.exports.Captcha = db.model('captcha', Captcha);

        <!--################################## Funds Transfer Log Schema ##############################################-->
        <!--#########################################################################################################-->
        var fundsTransferLog = new Schema({
            transactionDate: {type: Date, required: true},
            institutionId: {type: String, required: true},
            customerId: {type: String, required: true},
            fromAccountNo: {type: String, required: true},
            fromAccountType: {type: String},
            toAccountNo: {type: String, required: true},
            toAccountType: {type: String},
            amount: {type: Number, required: true},
            remarks: {type: String},
            transactionType: {type: String, required: true},
            payType: {type: String, required: true}
        });

        fundsTransferLog.plugin(timestamps);

        module.exports.FundsTransferLog = db.model('fundsTransferLog', fundsTransferLog);

        <!--################################## Funds Transfer Log Schema ##############################################-->
        <!--#########################################################################################################-->
        var fundsTransferLogsAck = new Schema({
            transactionDate: {type: Date, required: true},
            eodDate: {type: Date, required: true},
            institutionId: {type: String, required: true},
            customerId: {type: String, required: true},
            fromAccountNo: {type: String, required: true},
            fromAccountType: {type: String},
            toAccountNo: {type: String, required: true},
            toAccountType: {type: String},
            amount: {type: Number, required: true},
            remarks: {type: String}
        });

        fundsTransferLog.plugin(timestamps);

        module.exports.FundsTransferLogsAck = db.model('fundstransferlogsacks', fundsTransferLogsAck);


        <!--################################## Funds Transfer Failure Log Schema ##############################################-->
        <!--#########################################################################################################-->
        var fundsTransferStatusLog = new Schema({
            transactionDate: {type: Date, required: true},
            institutionId: {type: String, required: true},
            customerId: {type: String, required: true},
            customerName: {type: String},
            userId: {type: String, required: true},
            fromAccountNo: {type: String, required: true},
            fromAccountType: {type: String},
            toAccountNo: {type: String, required: true},
            toAccountType: {type: String},
            amount: {type: Number, required: true},
            remarks: {type: String},
            frequency: {type: String},
            status: {type: String},
            reason: {type: String},
            transactionType: {
                type: String,
                enum: ['TRANSFERMONEY', 'WIRE', 'ACH'],
                default: 'TRANSFERMONEY',
                required: true
            },
            isScheduledTransaction: {type: Boolean, default: true, required: true},
        });

        fundsTransferStatusLog.plugin(timestamps);

        module.exports.FundsTransferStatusLog = db.model('fundsTransferStatusLog', fundsTransferStatusLog);


        <!--################################## Transfer Instruction Schema ##############################################-->
        <!--#########################################################################################################-->
        var TransferInstruction = new Schema({
            bankId: String,
            customerId: String,
            userId: String,
            instructions: [
                {
                    dateOfInstruction: Date,
                    startDate: Date,
                    endDate: Date,
                    sourceAccountNo: String,
                    sourceAccountCategory: String,
                    sourceAccountType: String,
                    targetAccountNo: String,
                    targetAccountCategory: String,
                    targetAccountType: String,
                    description: String,
                    amount: Number,
                    frequency: {
                        type: String,
                        enum: ['DAILY', 'WEEKLY','BI-WEEKLY','FORTNIGHTLY',
                            'MONTHLY', 'QUARTERLY', 'SEMI-ANNUALLY', 'ANNUALLY']
                    },
                    lastTransferDate: Date,
                    nextTransferDate: Date,
                    SuccessfulTransfers: {type: Number, default: 0},
                    totalNofailedTransfers: {type: Number, default: 0},
                    noOfRetries: {type: Number, default: 0},
                    loanPayType: {type: String},
                    transferHistory: {
                        type: [{
                            dateOfTransfer: Date,
                            status: String,
                            amount: Number,
                            retryCount: {type: Number, default: 0}
                        }], default: function () {
                            return [];
                        }
                    },
                    status: {
                        type: String,
                        enum: ['ACTIVE', 'CANCELED', 'COMPLETED']
                    }
                }]
        });

        TransferInstruction.set('versionKey', false);
        TransferInstruction.plugin(timestamps);
//TransferInstructions.index( { institutionId: 1 }, { unique: true } );
        module.exports.TransferInstruction = db.model('transferInstruction', TransferInstruction);

        <!--################################## Transfer Instruction Schema ##############################################-->
        <!--#########################################################################################################-->
        var HolidayCalender = new Schema({
            institutionId: {type: String, required: true},
            date: {type: String, required: true},// MM/DD/YYYY
            type: {type: String, required: true, enum: ['fundsTransfer', 'wireTransfer', 'achTransfer']}
        });

        HolidayCalender.index({institutionId: 1, date: 1, type: 1}, {unique: true});
        HolidayCalender.plugin(timestamps);
        module.exports.HolidayCalender = db.model('holidayCalender', HolidayCalender);

    };


})();