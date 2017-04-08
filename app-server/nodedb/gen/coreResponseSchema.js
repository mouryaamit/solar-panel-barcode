(function(){

    var paperwork = require('../lib/utils/paperwork');

    module.exports = {
        StopPaymentCheckList : {
            "RESPONSE_NAME": "",
            "INSTANCE": {
                "stopPaymentData": [
                    {
                        "instructionId": '',
                        "accountNo": '',
                        "checkDate": '',
                        "lowCheckNo": '',
                        "highCheckNo": '',
                        "HighAmount": '',
                        "lowAmount": '',
                        "stopStatus": '',
                        "sourceType": '',
                        "expirationDate": '',
                        "reason": ''
                    }
                ],
                "requestId": 0.00,
                "status": {
                    "statusCode": "",
                    "statusDescription": "",
                    "severity": ""
                }
            }
        },
        customerInquiry: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "customerData": {
                    "customerId": '',
                    "partyId": '',
                    "customerType": '',
                    "fullName": '',
                    "organizationName": '',
                    "businessType": '',
                    "ssnOrTinNumber": '',
                    "title": '',
                    "firstName": '',
                    "middleName": '',
                    "lastName": '',
                    "dateOfBirth": {
                        "date": ''
                    },
                    "motherMaidenName": '',
                    "statementName": '',
                    "businessCode": '',
                    "preferredName": '',
                    "prefixName": '',
                    "suffixName": '',
                    "gender": '',
                    "occupation": '',
                    "maritalStatus": '',
                    "oedCode": '',
                    "defaultAddress": {
                        "addressType": '',
                        "addressLine1": '',
                        "addressLine2": '',
                        "countryCode": '',
                        "city": '',
                        "state": '',
                        "zip": ''
                    },
                    "workPhoneNumbersData": {
                        "type": '',
                        "phoneNumber": ''
                    },
                    "homePhoneNumbersData": {
                        "type": '',
                        "phoneNumber": ''
                    },
                    "driversLicenseData": {
                        "number": '',
                        "state": '',
                        "expirationDate": {
                            "date": ''
                        },
                        "issuedDate": {
                            "date": ''
                        }
                    },
                    "ofacChecked": false,
                    "emailAddress": '',
                    "cellPhoneNumberData": {
                        "type": '',
                        "phoneNumber": ''
                    },
                    "registrationIdentityDatas": [
                        {
                            "registeredIdType": '',
                            "registeredName": '',
                            "registeredIdValue": '',
                            "state": '',
                            "expiryDate": {
                                "date": ''
                            }
                        }
                    ],
                    "officerCode": '',
                    "PartyAcctRelData": '',
                    "customerAccounts": [
                        {
                            "accountNo": '',
                            "bankId": '',
                            "availableBalance": {
                                "currency": '',
                                "amount": 0.00,
                                "debitOrCredit": 1
                            },
                            "principleBalance": {
                                "currency": '',
                                "amount": 0.00,
                                "debitOrCredit": 1
                            },
                            "ledgerBalance": {
                                "currency": '',
                                "amount": 0.00,
                                "debitOrCredit": 1
                            },
                            "amountPayoff": {
                                "currency": '',
                                "amount": 0.00
                            },
                            "responsibilityType": '',
                            "productName": '',
                            "productTypeName": '',
                            "irsPlanNumber": '',
                            "branchName": '',
                            "accountType": '',
                            "statusCode": ''
                        }],
                    "bussinessCode": ''
                },
                "routingNumber":"",
                "requestId": 0.00,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        customerSearch: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "customerData": [
                    {
                    "customerId": '',
                    "customerType": '',
                    "fullName": '',
                    "dateOfBirth": {
                        "date": ''
                    },
                    "gender": '',
                    "defaultAddress": {
                        "addressType": '',
                        "addressLine1": '',
                        "addressLine2": '',
                        "countryCode": '',
                        "city": '',
                        "state": '',
                        "zip": ''
                    },
                    "emailAddress": '',
                    "cellPhoneNumberData": {
                        "type": '',
                        "phoneNumber": ''
                    }
                }],
                "requestId": 0.00,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }

            }
        },
        accountInquiry:{
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "accountSummaryData": {
                    "accountCategory": '',
                    "accountNo": '',
                    "institution": {
                        "id": '',
                        "name": ''
                    },
                    "branch": {
                        "id": '',
                        "name": ''
                    },
                    "accountStatus": '',
                    "accountType": '',
                    "iraPlanNumber": '',
                    "code": '',
                    "primaryOwnerData": '',
                    "accountStatmentAddress": '',
                    "interestAccrued": 0.00,
                    "annualPercentage": 0.00,
                    "primaryAccountOwner": {
                        "responsibilityType": '',
                        "isAuthorizedSigner": false,
                        "customer": {
                            "customerId": '',
                            "partyId": '',
                            "customerType": '',
                            "organizationName": '',
                            "businessType": '',
                            "bussinessCode": "",
                            "firstName": '',
                            "lastName": '',
                            "title": '',
                            "middleName": '',
                            "dateOfBirth": {
                                "date": ''
                            },
                            "motherMaidenName": '',
                            "statementName": '',
                            "businessCode": '',
                            "suffixName": '',
                            "gender": '',
                            "occupation": '',
                            "oedCode": '',
                            "emailAddress": '',
                            "ssnOrTinNumber": '',
                            "defaultAddress": {
                                "addressType": '',
                                "addressLine1": '',
                                "addressLine2": '',
                                "city": '',
                                "state": '',
                                "zip": '',
                                "countryCode": ''
                            },
                            "fullName": '',
                            "workPhoneNumbersData": {
                                "type": '',
                                "phoneNumber": ''
                            },
                            "homePhoneNumbersData": {
                                "type": '',
                                "phoneNumber": ''
                            },
                            "cellPhoneNumberData": {
                                "type": '',
                                "phoneNumber": ''
                            },
                            "driversLicenseData": {
                                "number": '',
                                "state": '',
                                "expirationDate": {
                                    "date": ''
                                },
                                "issuedDate": {
                                    "date": ''
                                }
                            },
                            "preferredName": '',
                            "prefixName": '',
                            "ofacChecked": false,
                            "maritalStatus": '',
                            "registrationIdentityDatas": [
                                {
                                    "registeredIdType": '',
                                    "registeredName": '',
                                    "registeredIdValue": '',
                                    "state": '',
                                    "expiryDate": {
                                        "date": ''
                                    }
                                }
                            ],
                            "officerCode": '',
                            "PartyAcctRelData": '',
                            "branchId": ''
                        }
                    },
                    "dateMaturity": {
                        "date": ''
                    },
                    "dateLastpayment":  {
                        "date": ''
                    },
                    "amountLastPayment":  {
                        "currency": '',
                        "amount": 0.00
                    },
                    "creditLineAmount": {
                        "currency": '',
                        "amount": 0.00
                    },
                    "crediLimit": {
                        "currency": '',
                        "amount": 0.00
                    },
                    "openDate": {
                        "date": ''
                    },
                    "maturityDate": {
                        "date": ''
                    },
                    "amountPayoff": {
                        "currency": '',
                        "amount": 0.00
                    },

                    //Specific to Account Inquiry Loan
                    "amountNextPayment": {
                        "currency": '',
                        "amount": 0.00
                    },
                    "amountOrginal": {
                        "currency": '',
                        "amount": 0.00
                    },
                    "ytdInterest": {
                        "currency": '',
                        "amount": 0.00
                    },
                    "amountPastDue": {
                        "currency": '',
                        "amount": 0.00
                    },
                    "principleBalance": {
                        "currency": '',
                        "amount": 0.00,
                        "debitOrCredit": 0.00
                    },

                    //Specific to Account Inquiry Deposit
                    "productTypeName": '',
                    "dateNextPayment": {
                        "date": ''
                    },
                    "loanAmount": {
                        "currency": '',
                        "amount": 0.00
                    },
                    "accountSubType": '',
                    "productTypeId": '',
                    "term": '',
                    "holdAmount": {
                        "currency": '',
                        "amount": 0.00
                    },
                    "overdraftLimit": {
                        "currency": '',
                        "amount": 0.00
                    },
                    "ledgerBalance": {
                        "currency": '',
                        "amount": 0.00,
                        "debitOrCredit": 0.00
                    },
                    "availableBalance": {
                        "currency": '',
                        "amount": 0.00,
                        "debitOrCredit": 0.00
                    },
                    "interestRate": 0.00,
                    "previousYtdInterestPaid": {
                        "currency": '',
                        "amount": 0.00
                    },
                    "interestPaid": {
                        "currency": '',
                        "amount": 0.00
                    },
                    "statementDate": {
                        "date": ''
                    }
                },
                "requestId": 0.00,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        transactionInquiry: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "transactionsData": [
                    {
                        "accountNumber": '',
                        "stmtRunningBal": 0.00,
                        "traceNumber": 0.00,
                        "lastFourDigitsCardNumber": 0.00,
                        "currentAmount": 0.00,
                        "principal": 0.00,
                        "interest": 0.00,
                        "debitOrCredit": '',
                        "description": '',
                        "reference": '',
                        "transcode": '',
                        "checkNumber": '',
                        "postedDate": {
                            "date": ''
                        },
                        "isPaperItem":false,
                        "showPostedDate":false
                    }
                ],
                "requestId": 0.00,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        debitOrCredit: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "requestId": 0,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        stopPayment: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "instructionId": '',
                "requestId": 0,
                "status": {
                    "statusCode": '',
                    "overrideStatus":'',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        addAlert: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "alertId": '',
                "requestId": 0,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        listAlert: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "alerts": [{
                	id:'',
                	customerId:'',
                	accountNo:'',
                	dateLastSent:{date:''},
                	dateLastModified:{date:''},
                	dndFrom:'',
                	dndTo:'',
                	emailAddress:'',
                	smsAddress:'',
                	bankId:'',
                	param1:'',
                	param2:'',
                	alertTypeDesc:'',
                	alertToDesc:''
                	
                }],
                "requestId": 0,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        achInstruction: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "inbResponse": [{
                    "channelInstructionId": '',
                    "coreInstructionId": '',
                    "status": ''
                }],
                "requestId": 0,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        statementSearch: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "statements": [{
                        "date": {
                            "date": ''
                        },
                        "description": '',
                        "url": '',
                        "accountNumber":"",
                        "institutionId":"",
                        "statementId":"",
                        "accountTagId":""
                    }
                ],
                "requestId": 0,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        statementFile: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "statement": {
                    "type": "",
                    "data": ""
                },
                "requestId": 0,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        alertSending: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "isEmailSent": true,
                "requestId": 0,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        achSearchInstruction: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "maintenanceInstructions": [
                    {
                        "instructionId": 0,
                        "fundingAccount": '',
                        "individualName": '',
                        "individualIdNo": '',
                        "receivingRoutingNo": '',
                        "receivingAccountNo": '',
                        "transactionCode": '',
                        "amount": {
                            "currency": '',
                            "amount": 0
                        },
                        "discretionayData": '',
                        "addenda": '',
                        "prenote": false,
                        "secCode": '',
                        "paymentType": '',
                        "effectiveEntryDate": {
                            "date": ''
                        },
                        "instructionDescription": '',
                        "instructionDescretionaryData": '',
                        "recurringInstructionData": {
                            "frequencyType": '',
                            "endAfterPayments": '',
                            "endDate": {
                                "date": ''
                            },
                            "endDays": '',
                            "startDate": {
                                "date": ''
                            },
                            "nextInstructionDate": {
                                "date": ''
                            },
                            "lastProcessedDate": {
                                "date": ''
                            }
                        },
                        "instructionMinDate": {
                            "date": ''
                        },
                        "batchId": {
                            "batchId": '',
                            "inbInstructionId": ''
                        },
                        "fundingAccNumber": ''
                    }],
                "requestId": 0,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        bondCalculator: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "series": '',
                "issueDate": '',
                "denomination": '',
                "value": {
                    "currency": '',
                    "amount": 0
                },
                "interest": {
                    "currency": '',
                    "amount": 0
                },
                "requestId": 0,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        checkImages: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "base64_frontImage"   : '',
                "base64_rareImage"    : '',
                "checkImageStatus"  : '',
                "requestId"         : 0,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        instituteDate: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "institutionId": '',
                "institutionName": '',
                "lastProcesseDate": {
                    "date": ''
                },
                "nextBusinessDate": {
                    "date": ''
                },
                "lastBusinessDate": {
                    "date": ''
                },
                "nextProcessingDate": {
                    "date": ''
                },
                "businessDate": {
                    "date": ''
                },
                "processingDate": {
                    "date": ''
                },
                "nextWorkingDate": {
                    "date": ''
                },
                "isWorkingDate": '',
                "requestId"         : 0,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        pendingTransfer: {
            "RESPONSE_NAME": '',
            "INSTANCE": {
                "onetime": [{
                    "instructionId": '',
                    "sourceBankId": '',
                    "sourceAccountNo": '',
                    "targetBankId": '',
                    "targetAccountNo": '',
                    "transferAmount": '',
                    "numberOfTransfers": 0,
                    "automaticTransfer": '',
                    "allowOverdraft": '',
                    "isActive": '',
                    "transferFrequency": '',
                    "instructionStatus": 0,
                    "instructionDate": {
                        "date": ''
                    },
                    "startDate": {
                        "date": ''
                    },
                    "endDate": {
                        "date": ''
                    },
                    "remarks": ''
                }],
                "recurring": [{
                    "instructionId": '',
                    "sourceBankId": '',
                    "sourceAccountNo": '',
                    "targetBankId": '',
                    "targetAccountNo": '',
                    "transferAmount": '',
                    "numberOfTransfers": 0,
                    "automaticTransfer": '',
                    "allowOverdraft": '',
                    "isActive": '',
                    "transferFrequency": '',
                    "instructionStatus": 0,
                    "instructionDate": {
                        "date": ''
                    },
                    "startDate": {
                        "date": ''
                    },
                    "endDate": {
                        "date": ''
                    },
                    "remarks": ''
                }],
                "requestId": 0,
                "status": {
                    "statusCode": '',
                    "statusDescription": '',
                    "severity": ''
                }
            }
        },
        optionalFields: {
            "queryAmount"               :{
                "fromAmount":{
                    "currency": '',
                    "amount": '',
                    "debitOrCredit": ''
                },
                "toAmount":{
                    "currency": '',
                    "amount": '',
                    "debitOrCredit": ''
                }
            },
            "queryDate"                 :{
                "fromDate": {
                    "date":''
                },
                "toDate": {
                    "date": ''
                }
            },
            "queryCheque"               : {
                "chequeNoFrom":'',
                "chequeNoTo":''
            }
        },
        batchAuthorize : {
            batchList :[{
                batchId                 : '',
                effectiveDate           : ''
            }]
        },
        batchDeAuthorize : {
            declineList :[{
                batchId                 : ''
            }]
        },
        batchRemove : {
            batchRemoveList:[{
                batchId                 : ''
            }]
        },
        recipientRemove : {
            recipientRemoveList:[{
                recipientId             : ''
            }]
        },
        recipientExclude : {
            recipientExcludeList:[{
                recipientId             : ''
            }]
        },
        recipientInclude : {
            recipientIncludeList:[{
                recipientId             : ''
            }]
        },
        batchProcess : {
            batchList:[{
                batchId                                 : '',
                batchName                               : '',
                secCode                                 : '',
                accountNo                               : '',
                companyName                             : '',
                companyDiscretionaryData                : '',
                companyId                               : '',
                companyDescription                      : '',
                batchDescription                        : '',
                dateScheduled                           : '',
                frequency                               : '',
                dateScheduledProcess                    : '',
                expirationDate                          : '',
                effectiveDate                           : '',
                recipients                              : [{
                    batchId                                 : '' ,
                    recipientName                           : '',
                    recipientId                             : '',
                    identity                                : '',
                    accountNo                               : '',
                    routingNumber                           : '',
                    amount                                  : '',
                    transactionCode                         : '',
                    expirationDate                          : '',
                    addenda                                 : ''
                }]
            }]
        },
        securityQ : {
            securityQuestion:[{
                questionId                          : '',
                question                            : '',
                answer                              : ''
            }]
        },
        passwordExpirationInfo : {
            numberOfDaysPasswordExpire: '',
            numberOfDaysPasswordLock: '',
            expiryWarningAfter: ''
        },
        checkLastPasswordInfo : {
            numberOfPasswordCheck  : ''
        },
        deleteReminders : {
            reminderList :[{
                reminderId                 : ''
            }]
        },
        authorizeWire : {
            wireTransferList :[{
                wireTransferId             : ''
            }]
        },
        deleteBeneficiary : {
            beneficiaryList :[{
                beneficiaryId              : ''
            }]
        }
    }
})();