(function(){

    var paperwork = require('../lib/utils/paperwork');

    module.exports = {

        "/": {
            "request": {
                "method": "GET"
            }
        },
        "/admin": {
            "request": {
                "method": "GET"
            }
        },
        "/iris/init": {
            "request": {
                "method": "GET"
            }
        },
        "/iris/keep/alive": {
            "request": {
                "method": "GET"
            }
        },
        "/iris/page/hit": {
            "request": {
                "method": "POST",
                "body": {
                    "section"                   : ".+",
                    "pageName"                  : ".+"
                }
            }
        },
        "/iris/login": {
            "request": {
                "method": "POST",
                "body": {
                    "userName"                  : ".+",
                    "password"                  : ".+"
                }
            }
        },
        "/iris/first/change": {
            "request": {
                "method": "POST",
                "body": {
                    "userName"                  : ".+",
                    "password"                  : ".+",
                    "checkUserId"               : /(true|false)/,
                    "securityQuestion"          : checkSecurityQuestion
                }
            }
        },
        "/iris/mfa/question": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/verify/mfa": {
            "request": {
                "method": "POST",
                "body": {
                    "securityQuestion": {
                        "questionId"            : ".+",
                        "question"              : ".+",
                        "answer"                : ".+"
                    }
                }
            }
        },
        "/iris/check/availability": {
            "request": {
                "method": "POST",
                "body": {
                    "userName"                  : ".+"
                }
            }
        },
        "/iris/list/security/question": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/user/security/question": {
            "request": {
                "method": "POST",
                "body": {
                    userName : ".+"
                }
            }
        },
        "/iris/user/all/security/question": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/verify/security/question": {
            "request": {
                "method": "POST",
                "body": {
                    userId : ".+",
                    "securityQuestion"          : checkVerifySQ
                }
            }
        },
        "/iris/routing/number": {
            "request": {
                "method": "POST",
                "body": {
                    "bankName"                  : ".+",
                    "stateCode"                 : ".+",
                    "city"                      : ".+"
                }
            }
        },
        "/iris/change/password": {
            "request": {
                "method": "POST",
                "body": {
                    "currentPassword"           : ".+",
                    "newPassword"               : ".+"
                }
            }
        },
        "/iris/add/user": {
            "request": {
                "method": "POST",
                "body": {
                    "customerId"                : ".+",
                    "customerName"              : ".+",
                    "userName"                  : ".+",
                    "emailId"                   : ".+",
                    "password"                  : ".+",
                    "mobileNo"                  : ".+",
                    "customerType"              : ".+",
                    "accessType"                : ".+"
                }
            }
        },
        "/iris/add/direct": {
            "request": {
                "method": "POST",
                "body": {
                    "customerId"                : ".+",
                    "userName"                  : ".+",
                    "emailId"                   : ".+",
                    "password"                  : ".+",
                    "mobileNo"                  : ".+",
                    "customerType"              : ".+",
                    "accessType"                : ".*"
                }
            }
        },
        "/iris/change/security/question": {
            "request": {
                "method": "POST",
                "body": {
                    "securityQuestion"          : checkSecurityQuestion
                }
            }
        },
        "/iris/change/personal/info": {
            "request": {
                "method": "POST",
                "body": {
                    "userName"                 :".+",
                    "AddressLine1"             :".*",
                    "AddressLine2"             :".*",
                    "city"                     :".*",
                    "state"                    :".*",
                    "zip"                      :".*",
                    "country"                  :".*",
                    "homePhone"                :".*",
                    "workPhone"                :".*",
                    "cellPhone"                :".*",
                    "emailId"                  :".*",
                    "changeInfo"               :/(true|false)/
                }
            }
        },
        "/iris/logout": {
            "request": {
                "method": "POST"
            }
        },

        "/iris/create/batch": {
            "request": {
                "method": "POST",
                "body": {
                    "batchName"                 : ".+",
                    "secCode"                   : ".+",
                    "accountNo"                 : "[0-9]",
                    "companyName"               : ".+",
                    "companyDiscretionaryData"  : ".*",
                    "companyId"                 : ".+",
                    "companyDescription"        : ".*",
                    "batchDescription"          : ".+",
                    "scheduleType"              : ".+",
                    "dateScheduled"             : ".*",
                    "frequency"                 : ".+",
                    "dateScheduledProcess"      : ".*",
                    "expirationDate"            : ".*"
                }
            }
        },
        "/iris/create/recipient": {
            "request": {
                "method": "POST",
                "body": {
                    "batchId"                   : ".+",
                    "recipientName"             : ".+",
                    "identity"                  : ".+",
                    "accountNo"                 : "[0-9]",
                    "routingNumber"             : "[0-9]",
                    "amount"                    : "[0-9]*",
                    "transactionCode"           : "[0-9]",
                    "expirationDate"            : ".*",
                    "addenda"                   : ".*"
                }
            }
        },
        "/iris/approve/batch": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/decline/batch": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/batch/recipient": {
            "request": {
                "method": "POST",
                "body": {
                    "batchId"                   : ".+"
                }
            }
        },
        "/iris/upload/ach": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/ach/batch/process": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/ach/batch/remove": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/ach/list": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/file/batch": {
            "request": {
                "method": "POST",
                "body": {
                    "fileId"                : ".+"
                }
            }
        },
        "/iris/exclude/recipient": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/include/recipient": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/list/batch": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/list/pending/batch": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/list/editable/batch": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/update/batch": {
            "request": {
                "method": "POST",
                "body": {
                    "batchId"                    : ".+",
                    "batchName"                  : ".+",
                    "secCode"                    : ".+",
                    "accountNo"                  : "[0-9]",
                    "companyName"                : ".+",
                    "companyDiscretionaryData"   : ".*",
                    "companyId"                  : ".+",
                    "companyDescription"         : ".*",
                    "batchDescription"           : ".+",
                    "scheduleType"               : ".+",
                    "dateScheduled"              : ".*",
                    "frequency"                  : ".+",
                    "dateScheduledProcess"       : ".*",
                    "expirationDate"             : ".*"
                }
            }
        },
        "/iris/update/recipient": {
            "request": {
                "method": "POST",
                "body": {
                    "recipientId"                : ".+",
                    "recipientName"              : ".+",
                    "identity"                   : ".+",
                    "accountNo"                  : "[0-9]",
                    "routingNumber"              : "[0-9]",
                    "amount"                     : "[0-9]*",
                    "transactionCode"            : "[0-9]",
                    "expirationDate"             : ".*",
                    "addenda"                    : ".*"
                }
            }
        },
        "/iris/remove/batch": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/remove/recipient": {
            "request": {
                "method": "POST"
            }
        },

        "/iris/supervisor/add/user": {
            "request": {
                "method": "POST",
                "body": {
                    "customerId"                : ".+",
                    "customerName"              : ".+",
                    "userName"                  : ".+",
                    "emailId"                   : ".+",
                    "mobileNo"                  : ".+",
                    "customerType"              : ".+",
                    "userViewAccess"            : {
                        "Accounts": {
                            "Overview": /(true|false)/,
                            "DetailsHistory": /(true|false)/,
                            "Statements": /(true|false)/
                        },
                        "Payments": {
                            "BillPay": /(true|false)/,
                            "PendingTransfer": /(true|false)/,
                            "FundsTransfer": /(true|false)/,
                            "TransferMoneyAtOtherFI": /(true|false)/,
                            "ThirdPartyTransfer": /(true|false)/,
                            "PayOtherPeople": /(true|false)/
                        },
                        "PaymentsWireTransfer": {
                            "WireTransferAuthorization": /(true|false)/,
                            "WireTransferRequest": /(true|false)/,
                            "ListBeneficiary": /(true|false)/,
                            "RegisterBeneficiary": /(true|false)/
                        },
                        "BusinessServicesACH": {
                            "ACHFileImportAuthorization": /(true|false)/,
                            "ACHFileImport": /(true|false)/,
                            "ACHBatchAuthorization": /(true|false)/,
                            "ACHRecipients": /(true|false)/,
                            "ACHAddNewRecipients"   : /(true|false)/,
                            "CreateNewBatch": /(true|false)/,
                            "ACHBatchSummary": /(true|false)/
                        },
                        "BusinessServicesWireTransfer": {
                            "WireTransferAuthorization": /(true|false)/,
                            "WireTransferRequest": /(true|false)/,
                            "ListBeneficiary": /(true|false)/,
                            "RegisterBeneficiary": /(true|false)/
                        },
                        "BusinessServices": {
                            "BusinessFundsTransfer" : /(true|false)/,
                            "BusinessThirdPartyTransfer" : /(true|false)/,
                            "PositivePay": /(true|false)/,
                            "BillPay": /(true|false)/
                        },
                        "OtherServices": {
                            "OrderChecks": /(true|false)/,
                            "StopPayments": /(true|false)/
                        },
                        "ProfileManagement": {
                            "ChangePassword": /(true|false)/,
                            "ChangeSecurityQuestion": /(true|false)/,
                            "ChangePersonalInfo": /(true|false)/,
                            "Reminders": /(true|false)/,
                            "Alerts": /(true|false)/
                        },
                        "AdministrativeTools": {
                            "SessionsReport": /(true|false)/,
                            "BankMail": /(true|false)/
                        },
                        "AdministrativeToolsUserManagement": {
                            "CreateNewUsers": /(true|false)/,
                            "Users": /(true|false)/
                        },
                        "Calculators": {
                            "Bond": /(true|false)/,
                            "Retirement": /(true|false)/,
                            "Savings": /(true|false)/,
                            "Loan": /(true|false)/
                        }
                    },
                    "userAccountAccess"         : checkAccountTrue,
                    "userTransferAccess"        : checkAccountTrue,
                    "userLimits"                : {
                        "achLimits"     : {
                            "achCreditLimitPerTranc"    : ".*",
                            "achCreditLimitPerDay"      : ".*",
                            "achDebitLimitPerTranc"     : ".*",
                            "achDebitLimitPerDay"       : ".*",
                            "restrictEdit"              : /(true|false)/
                        },
                        "fundsLimits"   : {
                            "fundsLimitPerTranc"        : ".*",
                            "fundsLimitPerDay"          : ".*"
                        },
                        "wireLimits"    : {
                            "wireLimitPerTranc"         : ".*",
                            "wireLimitPerDay"           : ".*",
                            "restrictEdit"              : /(true|false)/
                        }
                    }
                }
            }
        },
        "/iris/supervisor/edit/limits": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"              : '.+',
                    "userLimits"                : {
                        "achLimits"     : {
                            "achCreditLimitPerTranc"    : ".+",
                            "achCreditLimitPerDay"      : ".+",
                            "achDebitLimitPerTranc"     : ".+",
                            "achDebitLimitPerDay"       : ".+",
                            "restrictEdit"              : /(true|false)/
                        },
                        "fundsLimits"   : {
                            "fundsLimitPerTranc"        : ".+",
                            "fundsLimitPerDay"          : ".+"
                        },
                        "wireLimits"    : {
                            "wireLimitPerTranc"         : ".+",
                            "wireLimitPerDay"           : ".+",
                            "restrictEdit"              : /(true|false)/
                        }
                    }
                }
            }
        },
        "/iris/supervisor/edit/account/access": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"              : '.+',
                    "accountAccess"             : {
                        "accountsAccess"            : checkAccountTrue,
                        "accountsTransferAccess"    : checkAccountTrue
                    }
                }
            }
        },
        "/iris/supervisor/edit/user/views": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"              : '.+',
                    "userViewAccess"            : {
                        "Accounts": {
                            "Overview": /(true|false)/,
                            "DetailsHistory": /(true|false)/,
                            "Statements": /(true|false)/
                        },
                        "Payments": {
                            "BillPay": /(true|false)/,
                            "PendingTransfer": /(true|false)/,
                            "FundsTransfer": /(true|false)/,
                            "TransferMoneyAtOtherFI": /(true|false)/,
                            "ThirdPartyTransfer": /(true|false)/,
                            "PayOtherPeople": /(true|false)/
                        },
                        "PaymentsWireTransfer": {
                            "WireTransferAuthorization": /(true|false)/,
                            "WireTransferRequest": /(true|false)/,
                            "ListBeneficiary": /(true|false)/,
                            "RegisterBeneficiary": /(true|false)/
                        },
                        "BusinessServicesACH": {
                            "ACHFileImportAuthorization": /(true|false)/,
                            "ACHFileImport": /(true|false)/,
                            "ACHBatchAuthorization": /(true|false)/,
                            "ACHRecipients": /(true|false)/,
                            "ACHAddNewRecipients"   : /(true|false)/,
                            "CreateNewBatch": /(true|false)/,
                            "ACHBatchSummary": /(true|false)/
                        },
                        "BusinessServicesWireTransfer": {
                            "WireTransferAuthorization": /(true|false)/,
                            "WireTransferRequest": /(true|false)/,
                            "ListBeneficiary": /(true|false)/,
                            "RegisterBeneficiary": /(true|false)/
                        },
                        "BusinessServices": {
                            "BusinessFundsTransfer" : /(true|false)/,
                            "BusinessThirdPartyTransfer" : /(true|false)/,
                            "PositivePay": /(true|false)/,
                            "BillPay": /(true|false)/
                        },
                        "OtherServices": {
                            "OrderChecks": /(true|false)/,
                            "StopPayments": /(true|false)/
                        },
                        "ProfileManagement": {
                            "ChangePassword": /(true|false)/,
                            "ChangeSecurityQuestion": /(true|false)/,
                            "ChangePersonalInfo": /(true|false)/,
                            "Reminders": /(true|false)/,
                            "Alerts": /(true|false)/
                        },
                        "AdministrativeTools": {
                            "SessionsReport": /(true|false)/,
                            "BankMail": /(true|false)/
                        },
                        "AdministrativeToolsUserManagement": {
                            "CreateNewUsers": /(true|false)/,
                            "Users": /(true|false)/
                        },
                        "Calculators": {
                            "Bond": /(true|false)/,
                            "Retirement": /(true|false)/,
                            "Savings": /(true|false)/,
                            "Loan": /(true|false)/
                        }
                    }
                }
            }
        },
        "/iris/supervisor/change/question": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"              : '.+',
                    "securityQuestion"          : checkSecurityQuestion
                }
            }
        },
        "/iris/supervisor/unlock/user": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"                    : ".+"
                }
            }
        },
        "/iris/supervisor/list/user": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/supervisor/delete/user": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"                    : ".+"
                }
            }
        },

        "/iris/payveris/session": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/payment/reject": {
            "request": {
                "method": "GET"
            }
        },
        "/iris/payment/logout": {
            "request": {
                "method": "GET"
            }
        },
        "/iris/payment/redirect": {
            "request": {
                "method": "GET"
            }
        },
        "/iris/payment/authenticate": {
            "request": {
                "method": "GET"
            }
        },
        "/iris/payment/redirect/SignOn/KeepAlive.aspx": {
            "request": {
                "method": "GET"
            }
        },


        "/iris/customer/inquiry": {
            "request": {
                "method": "POST",
                "body": {
                    "customerId"                : ".+"
                }
            }
        },
        "/iris/bond/calculate": {
            "request": {
                "method": "POST",
                "body": {
                    "series"                : ".+",
                    "issueDate"             : ".+",
                    "denomination"          : ".+"
                }
            }
        },
        "/iris/check/image": {
            "request": {
                "method": "POST",
                "body": {
                    "accountNumber"         : ".+",
                    "postedDate"            : ".+",
                    "checkNumber"           : ".+"
                }
            }
        },
        "/iris/customer/accounts": {
            "request": {
                "method": "POST",
                "body": {
                    "customerId"                : ".+"
                }
            }
        },
        "/iris/account/inquiry": {
            "request": {
                "method": "POST",
                "body": {
                    "accountNo"                 :".+",
                    "accountCategory"           :".+"
                }
            }
        },
        "/iris/statement/download": {
            "request": {
                "method": "POST",
                "body": {
                    "accountNumber"             : ".+",
                    "fromDate"                  : ".+",
                    "toDate"                    : ".+"
                }
            }
        },
        "/iris/statement/file": {
            "request": {
                "method": "POST",
                "body": {
                    "url"                       : ".+"
                }
            }
        },
        "/iris/transaction/inquiry": {
            "request": {
                "method": "POST",
                "body": {
                    "accountNo"                 :".+"
                    /*"queryAmount"               :{
                     "fromAmount":{
                     "currency": "USD",
                     "amount": -1100,
                     "debitOrCredit": 1
                     },
                     "toAmount":{
                     "currency": "USD",
                     "amount": 1000,
                     "debitOrCredit": 1
                     }
                     },
                     "queryDate"                 :{
                     "fromDate": {
                     "date":"01/01/2014"
                     },
                     "toDate": {
                     "date": "01/05/2015"
                     }
                     },
                     "queryCheque"               : {
                     "chequeNoFrom":012344,
                     "chequeNoTo":012346
                     }*/
                }
            }
        },
        "/iris/transaction/inquiry/download": {
            "request": {
                "method": "POST",
                "body": {
                    "accountNo"                 :".+",
                    "accountCategory"           :".+",
                    "download"                  : /(csv|pdf|txt|tsv|qfx|qbo)/
                    /*"queryAmount"               :{
                     "fromAmount":{
                     "currency": "USD",
                     "amount": -1100,
                     "debitOrCredit": 1
                     },
                     "toAmount":{
                     "currency": "USD",
                     "amount": 1000,
                     "debitOrCredit": 1
                     }
                     },
                     "queryDate"                 :{
                     "fromDate": {
                     "date":"01/01/2014"
                     },
                     "toDate": {
                     "date": "01/05/2015"
                     }
                     },
                     "queryCheque"               : {
                     "chequeNoFrom":012344,
                     "chequeNoTo":012346
                     }*/
                }
            }
        },
        "/iris/funds/transfer": {
            "request": {
                "method": "POST",
                "body": {
                    "remarks"                   : ".*",
                    "description"               : "[A-Za-z]*",
                    "checkNo"                   : "[0-9]*",
                    "transactionDate"           : ".+",
                    "transactionTime"           : ".+",
                    "debitFrom"                 : {
                        "accountNo"                 : "[0-9]",
                        "accountCategory"           : "[A-Z]",
                        "accountType"               : "[A-Z]",
                        "transactionAmount"         : {
                            "currency"                  : "[A-Z]",
                            "amount"                    : "[0-9]"
                        }
                    },
                    "creditTo"                  : {
                        "accountNo"                 : "[0-9]",
                        "accountCategory"           : "[A-Z]",
                        "accountType"               : "[A-Z]",
                        "transactionAmount"         : {
                            "currency"                  : "[A-Z]",
                            "amount"                    : "[0-9]"
                        }
                    },
                    "paySchedule" : ".+",
                    "frequency" : ".*",
                    "expirationDate": ".*"
                }
            }
        },
        "/iris/edit/funds/transfer": {
            "request": {
                "method": "POST",
                "body": {
                    "instructionId"             : ".+",
                    "remarks"                   : ".*",
                    "transactionDate"           : ".+",
                    "debitFrom"                 : {
                        "accountNo"                 : "[0-9]",
                        "transactionAmount"         : {
                            "amount"                    : "[0-9]"
                        }
                    },
                    "creditTo"                  : {
                        "accountNo"                 : "[0-9]",
                        "transactionAmount"         : {
                            "amount"                    : "[0-9]"
                        }
                    },
                    "paySchedule" : ".+",
                    "frequency" : ".*",
                    "expirationDate": ".*"
                }
            }
        },
        "/iris/delete/funds/transfer": {
            "request": {
                "method": "POST",
                "body": {
                    "instructionId"             : ".+",
                    "remarks"                   : ".*",
                    "transactionDate"           : ".+",
                    "debitFrom"                 : {
                        "accountNo"                 : "[0-9]",
                        "transactionAmount"         : {
                            "amount"                    : "[0-9]"
                        }
                    },
                    "creditTo"                  : {
                        "accountNo"                 : "[0-9]",
                        "transactionAmount"         : {
                            "amount"                    : "[0-9]"
                        }
                    },
                    "paySchedule" : ".+",
                    "frequency" : ".*",
                    "expirationDate": ".*"
                }
            }
        },
        "/iris/pending/transfer": {
            "request": {
                "method": "POST"
            }
        },

        "/iris/stop/payment": {
            "request": {
                "method": "POST",
                "body": {
                    "accountNo" : ".+",
                    "paymentType" : ".+",
                    "transaction" : ".+",
                    "reason" : ".+"
                }
            }
        },
        "/iris/list/stop/payment": {
            "request": {
                "method": "POST"
            }
        },

        "/iris/order/check": {
            "request": {
                "method": "POST",
                "body": {
                    "accountNo"         : ".+",
                    "startingCheckNo"   : ".+",
                    "noOfBoxes"         : ".+",
                    "design"            : ".+",
                    "style"             : ".+"
                }
            }
        },

        "/iris/add/reminder": {
            "request": {
                "method": "POST",
                "body": {
                    "reminderDate"      : ".+",
                    "schedule"          : ".+",
                    "reminderMessage"   : ".+"
                }
            }
        },
        "/iris/edit/reminder": {
            "request": {
                "method": "POST",
                "body": {
                    "reminderId"        : ".+",
                    "reminderDate"      : ".+",
                    "schedule"          : ".+",
                    "reminderMessage"   : ".+"
                }
            }
        },
        "/iris/delete/reminder": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/show/reminder": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/list/reminder": {
            "request": {
                "method": "POST"
            }
        },

        "/iris/add/alert": {
            "request": {
                "method": "POST",
                "body": {
                    "module" : ".+",
                    "alertMessage":".+",
                    "alertThroughEmail"  : /(true|false)/,
                    "alertThroughPhone"  : /(true|false)/
                }
            }
        },
        "/iris/edit/alert": {
            "request": {
                "method": "POST",
                "body": {
                    "alertId": ".+",
                    "module" : ".+",
                    "alertMessage":".+",
                    "alertThroughEmail"  : /(true|false)/,
                    "alertThroughPhone"  : /(true|false)/
                }
            }
        },
        "/iris/delete/alert": {
            "request": {
                "method": "POST",
                "body": {
                    "alertList" : checkAlert
                }
            }
        },
        "/iris/list/alert": {
            "request": {
                "method": "POST"
            }
        },

        "/iris/add/beneficiary": {
            "request": {
                "method": "POST",
                "body": {
                    "beneficiaryName"   : ".+",
                    "addressLine1": ".*",
                    "addressLine2": ".*",
                    "city": ".*",
                    "state": ".*",
                    "zip": ".*",
                    "country": ".*",
                    "recipientBankInfo": {
                        "accountNo": ".+",
                        "bankRoutingNo": ".+",
                        "bankName": ".+"
                    }
                }
            }
        },
        "/iris/edit/beneficiary": {
            "request": {
                "method": "POST",
                "body": {
                    "beneficiaryName"   : ".+",
                    "addressLine1": ".*",
                    "addressLine2": ".*",
                    "city": ".*",
                    "state": ".*",
                    "zip": ".*",
                    "country": ".*",
                    "recipientBankInfo": {
                        "accountNo": ".+",
                        "bankRoutingNo": ".+",
                        "bankName": ".+"
                    }
                }
            }
        },
        "/iris/list/beneficiary": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/delete/beneficiary": {
            "request": {
                "method": "POST",
                "body" : {
                    "beneficiaryList" : checkBeneficiary
                }
            }
        },
        "/iris/add/wire/transfer": {
            "request": {
                "method": "POST",
                "body": {
                    "beneficiaryId"     : ".+",
                    "fromAccount"       : ".+",
                    "fromAccountType"   : ".+",
                    "amount"            : ".+",
                    "scheduledInfo"     : {
                        "scheduledDate"     : ".+",
                        "scheduledType"     : ".+",
                        "frequency"         : ".*",
                        "expiryDate"        : ".*"
                    }
                }
            }
        },
        "/iris/list/wire/transfer": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/authorize/wire/transfer": {
            "request": {
                "method": "POST",
                "body": {
                    "wireTransferList" : checkAuthorizeWire
                }
            }
        },
        "/iris/delete/wire/transfer": {
            "request": {
                "method": "POST",
                "body": {
                    "wireTransferList" : checkAuthorizeWire
                }
            }
        },

        "/iris/send/mail": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/mail/inbox": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/mail/sent": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/mail/trash": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/trash/message": {
            "request": {
                "method": "POST",
                "body": {
                    "trashMessage"                 : checkTrash
                }
            }
        },
        "/iris/delete/trash": {
            "request": {
                "method": "POST",
                "body": {
                    "deleteMessage"                 : checkTrash
                }
            }
        },
        "/iris/reply/message": {
            "request": {
                "method": "POST",
                "body": {
                    "messageId"                 : ".+",
                    "message"                   : ".+",
                    "subject"                   : ".+"
                }
            }
        },
        "/iris/read/message": {
            "request": {
                "method": "POST",
                "body": {
                    "messageId"                 : ".+"
                }
            }
        },
        "/iris/show/policy": {
            "request": {
                "method": "GET"
            }
        },
        "/iris/validate/otp": {
            "request": {
                "method": "POST",
                "body": {
                    "otpService"                : /(firstLogin|multiFactorAuthentication|statements|wireTransferNewBeneficiary|wireTransferNewRequest|achNewBatch|achBatchAuthorization|orderChecks|stopPayment|changePassword|changeSecurityQuestion)/,
                    "otp"                       : ".+"
                }
            }
        },
        "/iris/validate/forgot/password/otp": {
            "request": {
                "method": "POST",
                "body": {
                    "userId"                    : ".+",
                    "otp"                       : ".+"
                }
            }
        },

        "/iris/admin/create": {
            "request": {
                "method": "POST",
                "body": {
                    "name"              : ".+",
                    "emailId"           : ".+",
                    "userName"          : ".+",
                    "phoneNo"           : ".+",
                    "viewAccess"        : {
                        "FiSecurityOptions" :{

                            "ChangePassword"                  : /(true|false)/,
                            "BankPassword"                    : /(true|false)/,
                            "UserSecurity"                 : /(true|false)/,
                            "GroupMail"                       : /(true|false)/
                        },
                        "CustomerSupport": {
                            "CustomerOnboarding"             : {
                                "BranchOnboarding"            : /(true|false)/
                            },
                            "CustomerLoginMaintenance"        : /(true|false)/,
                            "BankMail"                        : /(true|false)/,
                            "MailWording"                     : /(true|false)/,
                            "DeleteCustomer"                  : /(true|false)/,
                            "UserActivityReport"              : /(true|false)/,
                            "FindUserDetail"                  : /(true|false)/
                        },
                        "FiPolicies": {
                            "AccessType"                      : /(true|false)/,
                            "CustomerUserIdPassword"          : /(true|false)/,
                            "OtpConfiguration"                : /(true|false)/,
                            "LimitProfile"                    : /(true|false)/,
                            "MultiLingual"                        : /(true|false)/,
                            "Site"                            : /(true|false)/
                        },
                        "Reports": {
                            "DowntimeReport"                  : /(true|false)/,
                            "InactivityReport"                : /(true|false)/,
                            "InvalidLoginAttemptsReport"      : /(true|false)/,
                            "CustomerWisePageHits"            :/(true|false)/,
                            "PageHitsReport"                  : /(true|false)/
                        }
                    }
                }
            }
        },
        "/iris/admin/list":{
            "request": {
                "method": "POST"
            }
        },
        "/iris/admin/edit":{
            "request": {
                "method": "POST",
                "body": {
                    "name"              : ".+",
                    "emailId"           : ".+",
                    "phoneNo"           : ".+",
                    "viewAccess"        : {
                        "FiSecurityOptions" :{

                            "ChangePassword"                  : /(true|false)/,
                            "BankPassword"                    : /(true|false)/,
                            "UserSecurity"                 : /(true|false)/,
                            "GroupMail"                       : /(true|false)/
                        },
                        "CustomerSupport": {
                            "CustomerOnboarding"             : {
                                "BranchOnboarding"            : /(true|false)/
                            },
                            "CustomerLoginMaintenance"        : /(true|false)/,
                            "BankMail"                        : /(true|false)/,
                            "MailWording"                     : /(true|false)/,
                            "DeleteCustomer"                  : /(true|false)/,
                            "UserActivityReport"              : /(true|false)/,
                            "FindUserDetail"                  : /(true|false)/
                        },
                        "FiPolicies": {
                            "AccessType"                      : /(true|false)/,
                            "CustomerUserIdPassword"          : /(true|false)/,
                            "OtpConfiguration"                : /(true|false)/,
                            "LimitProfile"                    : /(true|false)/,
                            "MultiLingual"                    : /(true|false)/,
                            "Site"                            : /(true|false)/
                        },
                        "Reports": {
                            "DowntimeReport"                  : /(true|false)/,
                            "InactivityReport"                : /(true|false)/,
                            "InvalidLoginAttemptsReport"      : /(true|false)/,
                            "customerWisePageHits"            :/(true|false)/,
                            "PageHitsReport"                  : /(true|false)/
                        }

                    }
                }
            }
        },
        "/iris/admin/add/password/rule": {
            "request": {
                "method": "POST",
                "body": {
                    "minimumNumericChars"            : ".+",
                    "minimumUpperCaseChars"          : ".+",
                    "minimumLowerCaseChars"          : ".+",
                    "minimumSpecialChars"            : ".+",
                    "minimumLength"                  : ".+",
                    "checkLastPassword"              : ".+",
                    "restrictNameInPassword"         : /(true|false)/,
                    "restrictUserIdInPassword"       : /(true|false)/
                }
            }
        },
        "/iris/admin/show/password/rule": {
            "request": {
                "method": "GET"
            }
        },
        "/iris/admin/edit/password/rule": {
            "request": {
                "method": "POST",
                "body": {
                    "minimumNumericChars"            : ".+",
                    "minimumUpperCaseChars"          : ".+",
                    "minimumLowerCaseChars"          : ".+",
                    "minimumSpecialChars"            : ".+",
                    "minimumLength"                  : ".+",
                    "checkLastPassword"              : ".+",
                    "restrictNameInPassword"         : /(true|false)/,
                    "restrictUserIdInPassword"       : /(true|false)/
                }
            }
        },
        "/iris/admin/availability":{
            "request": {
                "method": "POST",
                "body": {
                    "userName" : ".+"
                }
            }
        },
        "/iris/admin/change/password":{
            "request": {
                "method": "POST",
                "body": {
                    "adminId"   : ".+",
                    "oldPassword"  : ".+",
                    "newPassword"  : ".+"
                }
            }
        },
        "/iris/admin/add/policy": {
            "request": {
                "method": "POST",
                "body": {
                    "userIdRestrictions"    : {
                        "minimumNumericChars"   : "^[+]?[0-9]*$",
                        "minimumAlphaChars"     : "^[+]?[0-9]*$",
                        "minimumSpecialChars"   : "^[+]?[0-9]*$",
                        "minimumLength"         : "^[+]?[0-9]*$"
                    },
                    "passwordRestrictions"  : {
                        "minimumNumericChars"   : "^[+]?[0-9]*$",
                        "minimumUpperCaseChars" : "^[+]?[0-9]*$",
                        "minimumLowerCaseChars" : "^[+]?[0-9]*$",
                        "minimumSpecialChars"   : "^[+]?[0-9]*$",
                        "minimumLength"         : "^[+]?[0-9]*$"
                    },
                    "restrictNameInPassword"    : /(true|false)/,
                    "restrictUserIdInPassword"  : /(true|false)/
                }
            }
        },
        "/iris/admin/change/policy": {
            "request": {
                "method": "POST",
                "body": {
                    "userIdRestrictions"    : {
                        "minimumNumericChars"   : "^[+]?[0-9]*$",
                        "minimumAlphaChars"     : "^[+]?[0-9]*$",
                        "minimumSpecialChars"   : "^[+]?[0-9]*$",
                        "minimumLength"         : "^[+]?[0-9]*$"
                    },
                    "passwordRestrictions"  : {
                        "minimumNumericChars"   : "^[+]?[0-9]*$",
                        "minimumUpperCaseChars" : "^[+]?[0-9]*$",
                        "minimumLowerCaseChars" : "^[+]?[0-9]*$",
                        "minimumSpecialChars"   : "^[+]?[0-9]*$",
                        "minimumLength"         : "^[+]?[0-9]*$"
                    },
                    "restrictNameInPassword"    : /(true|false)/,
                    "restrictUserIdInPassword"  : /(true|false)/
                }
            }
        },
        "/iris/admin/show/policy": {
            "request": {
                "method": "GET"
            }
        },
        "/iris/admin/login": {
            "request": {
                "method": "POST",
                "body": {
                    "userName"                  : ".+",
                    "password"                  : ".+"
                }
            }
        },
        "/iris/admin/logout": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/list/accesstype": {
            "request": {
                "method": "GET"
            }
        },
        "/iris/add/accesstype": {
            "request": {
                "method": "POST",
                "body": {
                    "accessType": ".+",
                    "userViews": {
                        "Accounts": {
                            "Overview": /(true|false)/,
                            "DetailsHistory": /(true|false)/,
                            "Statements": /(true|false)/
                        },
                        "Payments": {
                            "BillPay": /(true|false)/,
                            "PendingTransfer": /(true|false)/,
                            "FundsTransfer": /(true|false)/,
                            "TransferMoneyAtOtherFI": /(true|false)/,
                            "ThirdPartyTransfer": /(true|false)/,
                            "PayOtherPeople": /(true|false)/
                        },
                        "PaymentsWireTransfer": {
                            "WireTransferAuthorization": /(true|false)/,
                            "WireTransferRequest": /(true|false)/,
                            "ListBeneficiary": /(true|false)/,
                            "RegisterBeneficiary": /(true|false)/
                        },
                        "BusinessServicesACH": {
                            "ACHFileImportAuthorization": /(true|false)/,
                            "ACHFileImport": /(true|false)/,
                            "ACHBatchAuthorization": /(true|false)/,
                            "ACHRecipients": /(true|false)/,
                            "ACHAddNewRecipients"   : /(true|false)/,
                            "CreateNewBatch": /(true|false)/,
                            "ACHBatchSummary": /(true|false)/
                        },
                        "BusinessServicesWireTransfer": {
                            "WireTransferAuthorization": /(true|false)/,
                            "WireTransferRequest": /(true|false)/,
                            "ListBeneficiary": /(true|false)/,
                            "RegisterBeneficiary": /(true|false)/
                        },
                        "BusinessServices": {
                            "BusinessFundsTransfer" : /(true|false)/,
                            "BusinessThirdPartyTransfer" : /(true|false)/,
                            "PositivePay": /(true|false)/,
                            "BillPay": /(true|false)/
                        },
                        "OtherServices": {
                            "OrderChecks": /(true|false)/,
                            "StopPayments": /(true|false)/
                        },
                        "ProfileManagement": {
                            "ChangePassword": /(true|false)/,
                            "ChangeSecurityQuestion": /(true|false)/,
                            "ChangePersonalInfo": /(true|false)/,
                            "Reminders": /(true|false)/,
                            "Alerts": /(true|false)/
                        },
                        "AdministrativeTools": {
                            "SessionsReport": /(true|false)/,
                            "BankMail": /(true|false)/
                        },
                        "AdministrativeToolsUserManagement": {
                            "CreateNewUsers": /(true|false)/,
                            "Users": /(true|false)/
                        },
                        "Calculators": {
                            "Bond": /(true|false)/,
                            "Retirement": /(true|false)/,
                            "Savings": /(true|false)/,
                            "Loan": /(true|false)/
                        }
                    }
                }
            }
        },
        "/iris/edit/accesstype": {
            "request": {
                "method": "POST",
                "body": {
                    "accessType": ".+",
                    "userViews": {
                        "UserType" : ".+",
                        "Accounts": {
                            "Overview": /(true|false)/,
                            "DetailsHistory": /(true|false)/,
                            "Statements": /(true|false)/
                        },
                        "Payments": {
                            "BillPay": /(true|false)/,
                            "PendingTransfer": /(true|false)/,
                            "FundsTransfer": /(true|false)/,
                            "TransferMoneyAtOtherFI": /(true|false)/,
                            "ThirdPartyTransfer": /(true|false)/,
                            "PayOtherPeople": /(true|false)/
                        },
                        "PaymentsWireTransfer": {
                            "WireTransferAuthorization": /(true|false)/,
                            "WireTransferRequest": /(true|false)/,
                            "ListBeneficiary": /(true|false)/,
                            "RegisterBeneficiary": /(true|false)/
                        },
                        "BusinessServicesACH": {
                            "ACHFileImportAuthorization": /(true|false)/,
                            "ACHFileImport": /(true|false)/,
                            "ACHBatchAuthorization": /(true|false)/,
                            "ACHRecipients": /(true|false)/,
                            "ACHAddNewRecipients"   : /(true|false)/,
                            "CreateNewBatch": /(true|false)/,
                            "ACHBatchSummary": /(true|false)/
                        },
                        "BusinessServicesWireTransfer": {
                            "WireTransferAuthorization": /(true|false)/,
                            "WireTransferRequest": /(true|false)/,
                            "ListBeneficiary": /(true|false)/,
                            "RegisterBeneficiary": /(true|false)/
                        },
                        "BusinessServices": {
                            "BusinessFundsTransfer" : /(true|false)/,
                            "BusinessThirdPartyTransfer" : /(true|false)/,
                            "PositivePay": /(true|false)/,
                            "BillPay": /(true|false)/
                        },
                        "OtherServices": {
                            "OrderChecks": /(true|false)/,
                            "StopPayments": /(true|false)/
                        },
                        "ProfileManagement": {
                            "ChangePassword": /(true|false)/,
                            "ChangeSecurityQuestion": /(true|false)/,
                            "ChangePersonalInfo": /(true|false)/,
                            "Reminders": /(true|false)/,
                            "Alerts": /(true|false)/
                        },
                        "AdministrativeTools": {
                            "SessionsReport": /(true|false)/,
                            "BankMail": /(true|false)/
                        },
                        "AdministrativeToolsUserManagement": {
                            "CreateNewUsers": /(true|false)/,
                            "Users": /(true|false)/
                        },
                        "Calculators": {
                            "Bond": /(true|false)/,
                            "Retirement": /(true|false)/,
                            "Savings": /(true|false)/,
                            "Loan": /(true|false)/
                        }
                    }
                }
            }
        },
        "/iris/search/customer": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/list/locked": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/unlock": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"                    : ".+"
                }
            }
        },
        "/iris/admin/inactive/users": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/find/users": {
            "request": {
                "method": "POST",
                "body": {
                    "emailId" : ".+"
                }
            }
        },
        "/iris/admin/delete/user": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"                    : ".+"
                }
            }
        },
        "/iris/reset/password": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"                    : ".+"
                }
            }
        },
        "/iris/search/invalid/login": {
            "request": {
                "method": "POST",
                "body": {
                    "customerType"                : ".+",
                    "searchFrom"                  : ".+",
                    "searchTo"                    : ".+"
                }
            }
        },
        "/iris/search/invalid/login/download": {
            "request": {
                "method": "POST",
                "body": {
                    "customerType"                : ".+",
                    "searchFrom"                  : ".+",
                    "searchTo"                    : ".+",
                    "download"                    : /(csv|pdf|tsv)/
                }
            }
        },
        "/iris/session/report": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"                : ".+",
                    "moduleType"                  : checkModuleType,
                    "fromDate"                    : ".+",
                    "toDate"                      : ".+"
                }
            }
        },
        "/iris/downtime/report": {
            "request": {
                "method": "POST",
                "body": {
                    "fromDate"                    : ".+",
                    "toDate"                      : ".+"
                }
            }
        },
        "/iris/session/report/download": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"                : ".+",
                    "moduleType"                  : ".+",
                    "fromDate"                    : ".+",
                    "toDate"                      : ".+",
                    "download"                    : /(csv|pdf|tsv)/
                }
            }
        },
        "/iris/admin/user/activity": {
            "request": {
                "method": "POST",
                "body": {
                    "customerType"                : /(bankUser|bankAdmin)/
                    //"download"                  : /(no|csv|pdf|tsv)/i
                }
            }
        },
        "/iris/admin/user/activity/download": {
            "request": {
                "method": "POST",
                "body": {
                    "customerType"                : /(bankUser|bankAdmin)/,
                    "download"                    : /(csv|pdf|tsv)/
                }
            }
        },
        "/iris/admin/send/mail": {
            "request": {
                "method": "POST",
                "body": {
                    "messageType"                 : /(Individual|AccessType)/,
                    "userName"                    : ".*",
                    "accessType"                  : ".*",
                    "message"                     : ".+",
                    "subject"                     : ".+"
                }
            }
        },
        "/iris/admin/mail/inbox": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/admin/mail/sent": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/admin/mail/trash": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/admin/trash/message": {
            "request": {
                "method": "POST",
                "body": {
                    "trashMessage"                 : checkTrash
                }
            }
        },
        "/iris/admin/delete/trash": {
            "request": {
                "method": "POST",
                "body": {
                    "deleteMessage"                 : checkTrash
                }
            }
        },
        "/iris/admin/reply/message": {
            "request": {
                "method": "POST",
                "body": {
                    "messageId"                 : ".+",
                    "sendToName"                : ".+",
                    "message"                   : ".+",
                    "subject"                   : ".+"
                }
            }
        },
        "/iris/admin/read/message": {
            "request": {
                "method": "POST",
                "body": {
                    "messageId"                 : ".+"
                }
            }
        },
        "/iris/admin/pagehit/overview": {
            "request": {
                "method": "POST",
                "body": {
                    "fromDate"                  : ".+",
                    "toDate"                    : ".+"
                }
            }
        },
        "/iris/admin/pagehit/page": {
            "request": {
                "method": "POST",
                "body": {
                    "fromDate"                  : ".+",
                    "pageName"                  : ".+",
                    "toDate"                    : ".+"
                }
            }
        },
        "/iris/admin/pagehit/customer": {
            "request": {
                "method": "POST",
                "body": {
                    "fromDate"                  : ".+",
                    "userId"                    : ".+",
                    "toDate"                    : ".+"
                }
            }
        },
        "/iris/admin/show/wording": {
            "request": {
                "method": "POST",
                "body": {
                    "mailType"                  : /(Welcome|Forgot Password|Temporary User ID|Temporary Password|Enrollment)/
                }
            }
        },
        "/iris/admin/add/wording": {
            "request": {
                "method": "POST",
                "body": {
                    "mailType"                  : /(Welcome|Forgot Password|Temporary User ID|Temporary Password|Enrollment)/,
                    "subject"                   : ".+",
                    "messageContent"            : ".+"
                }
            }
        },
        "/iris/admin/edit/wording": {
            "request": {
                "method": "POST",
                "body": {
                    "mailType"                  : /(Welcome|Forgot Password|Temporary User ID|Temporary Password|Enrollment)/,
                    "subject"                   : ".+",
                    "messageContent"            : ".+"
                }
            }
        },
        "/iris/admin/print/userid": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"              : ".+"
                }
            }
        },
        "/iris/admin/print/password": {
            "request": {
                "method": "POST",
                "body": {
                    "listedUserId"              : ".+"
                }
            }
        },
        "/iris/admin/add/language": {
            "request": {
                "method": "POST",
                "body": {
                    "selectedLang"              : checkModuleType
                }
            }
        },
        "/iris/list/language": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/add/thirdpartybeneficiary": {
            "request": {
                "method": "POST",
                "body": {
                    "beneficiaryName"   : ".+",
                    "recipientBankAcc": ".+"
                }
            }
        },
        "/iris/edit/thirdpartybeneficiary": {
            "request": {
                "method": "POST",
                "body": {
                    "beneficiaryName"   : ".+",
                    "recipientBankAcc": ".+"
                }
            }
        },
        "/iris/list/thirdpartybeneficiary": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/delete/thirdpartybeneficiary": {
            "request": {
                "method": "POST",
                "body" : {
                    "thirdpartybeneficiaryList" : checkthirdpartyBeneficiary
                }
            }
        },
        "/iris/deletePending/thirdpartybeneficiary": {
            "request": {
                "method": "POST",
                "body" : {
                    "beneficiaryPendingList" : ".+"
                }
            }
        },
        "/iris/admin/add/image": {
            "request": {
                "method": "POST",
                "body": {
                    "moduleType"                : /(header|footer|bigImage|smallImage|info1|info2|info3|insideHeader|insideSidebarImage)/,
                    "base64String"              : ".+",
                    "fileName"                  : ".+",
                    "fileSize"                  : ".+",
                    "fileDimension"             : ".+",
                    "fileType"                  : ".+"
                }
            }
        },
        "/iris/admin/delete/image": {
            "request": {
                "method": "POST",
                "body": {
                    "imageId"                   : ".+"
                }
            }
        },
        "/iris/admin/site/images": {
            "request": {
                "method": "POST",
                "body": {
                    "moduleType"                : /(header|footer|bigImage|smallImage|info1|info2|info3|insideHeader|insideSidebarImage)/
                }
            }
        },
        "/iris/admin/apply/site": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/show/otp/config": {
            "request": {
                "method": "POST"
            }
        },
        "/iris/update/otp/config": {
            "request": {
                "method": "POST",
                "body" : {
                    "forgotPassword"                : /(true|false)/,
                    "firstLogin"                    : /(true|false)/,
                    "multiFactorAuthentication"     : /(true|false)/,
                    "statements"                    : /(true|false)/,
                    "wireTransferNewBeneficiary"    : /(true|false)/,
                    "wireTransferNewRequest"        : /(true|false)/,
                    "achNewBatch"                   : /(true|false)/,
                    "achBatchAuthorization"         : /(true|false)/,
                    "orderChecks"                   : /(true|false)/,
                    "stopPayment"                   : /(true|false)/,
                    "changePassword"                : /(true|false)/,
                    "changeSecurityQuestion"        : /(true|false)/,
                    "sendThroughEmail"              : /(true|false)/,
                    "sendThroughPhone"              : /(true|false)/
                }
            }
        }
    };

    function checkSecurityQuestion(arr){
        var schema = [{
            "questionId"                : '',
            "question"                  : '',
            "answer"                    : ''
        }];

        return paperwork.accepted(schema, arr);
    }

    function checkAuthorizeWire(arr){
        var schema = [{
            "wireTransferId"           : ''
        }];

        return paperwork.accepted(schema, arr);
    }

    function checkBeneficiary(arr){
        var schema = [{
            "beneficiaryId"            : ''
        }];

        return paperwork.accepted(schema, arr);
    }
    function checkthirdpartyBeneficiary(arr){
        var schema = [{
            "thirdPartyBeneficiaryId"            : ''
        }];

        return paperwork.accepted(schema, arr);
    }
    function checkAlert(arr){
        var schema = [{
            "alertId"                   : ''
        }];

        return paperwork.accepted(schema, arr);
    }

    function checkVerifySQ(arr){
        var schema = [{
            "questionId"                : '',
            "answer"                    : ''
        }];

        return paperwork.accepted(schema, arr);
    }

    function checkTrash(arr){
        var schema = [{
            messageId                   : ''
        }];

        return paperwork.accepted(schema, arr);
    }

    function checkAccountTrue(arr){
        return true;
    }

    function checkModuleType(arr){
        return (arr.length > 0);
    }
})();