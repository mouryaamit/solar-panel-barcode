(function () {

    module.exports = {
        vsoftServer: {
            port: 3001,
            hostname: '192.168.2.211',
            path: '/iris-core-mapper/handleRequest'
        },
        vsoftACHServer: {
            port: 3001,
            hostname: '192.168.2.211',
            path: '/iris-core-mapper/handleRequest'
        },
        vsoftCheckCaptureServer: {
            protocol: 'http',//http or https
            port: 80,
            hostname: '192.168.2.213',
            path: '/VSoft.RDC.Service/institutions/',
            instId: 1,
            channel: 7,
            ApplicationId: 7,
            accountTypeMapping : {
                SAVINGS : 2,
                CHECKING : 1
            }
        },
        payverisServer: {
            hostname: 'test-api.regrpayverisbp.com',
            port: 443,
            CustomerServices: '/api/services/CustomerServices',
            APIKey: 'vsoft-test.20141230.Cr6fF8EpF3aMzy76JxLvk2Uv6C2ZAqywnRfg7WmR',
            clientCode: 'carter',
            ssoUrl: "https://test.regrpayverisbp.com/pp/"
        },
        vsoftAlertServer: {
            vsoftAlertServerHostname: '',
            vsoftAlertServerPort: 0,
            vsoftAlertServerPath: ''
        },
        omniWebServer: {
            host: '192.168.2.175',
            path: '/home/amourya/WebstormProjects/omni-channel/web/build',
            username: 'amourya',
            password: 'vsoftpassword'
        },
        checkfreeBillPay:{
            enabled : false,
            url : "https://cw411.checkfreeweb.com/imm/Auth/Login/13714"
        },
        EODExtractLocation: "/home/amourya/workspace/vsoftirisnew/InstId/iris",
        customerOnboarding: {
            branchOnboarding: {
                print: true,
                email: true,
                inPerson: true,
                customerIdSearch: true,
                accountNumberSearch: true,
                customerNameSearch: true
            }
        },
        intuitConfig:{
            BID : 16294,
            FID : 15544,
            ORG:"VSoft",
            BANKID:111906006
        },
        isUserPhysicalDelete:true,
        fileDownloadTimeout: 1, // In Min
        staticAssetsFolder: 'iris',
        emailTemplateFolder: 'iris',
        instId: '1',
        bankNameId: 'Carter Bank',
        isAccountMasked: true,
        isUserNameCaseSensitive: false,
        isSecurityAnswerCaseSensitive: true,
        isMFAEnabledInAdmin: false,
        sortAccountsBy : "accountTypeAndAccountNo", //accountNo,accountType,accountTypeAndAccountNo,none
        temporaryCredentialsExpiration: {
            client: {
                password: 10,
                userId: 10
            }
        },
        adminSession: {
            timedOut: 30, //mins
            alertBefore: 40 //secs
        },
        clientSession: {
            timedOut: 10, //mins
            alertBefore: 30 //secs
        },
        savedPassword: 3,  // password history
        weeklyOffForCalendar: {// 0 - Sunday, 1 - Monday, 2 - Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday
            fundsTransfer: [],
            wireTransfer: [],
            achTransfer: []
        },
        scheduler: {
            isEnabled: {
                wireTransfer: false,
                reminder: false,
                enroll: false,
                achUpdate: false,
                frbUpdate: false,
                fundsTransfer: true
            },
            time: {
                wireTransferAt: '10:30 pm', // IN LOCAL SERVER TIME ZONE
                reminderAt: '10:30 am', // IN LOCAL SERVER TIME ZONE
                enrollAt: '07:12 pm', // IN LOCAL SERVER TIME ZONE
                achUpdateAt: '02:00 pm', // IN LOCAL SERVER TIME ZONE
                frbUpdateAt: '07:44 pm', // IN LOCAL SERVER TIME ZONE
                fundsTransferAt: '06:33 pm' // IN LOCAL SERVER TIME ZONE
            }
        },
        eodTiming: {
            wireTransferEodAt: '10:30 pm', // IN LOCAL SERVER TIME ZONE
            achTransferEodAt: '02:00 pm', // IN LOCAL SERVER TIME ZONE
            fundsTransferEodAt: '06:25 pm' // IN LOCAL SERVER TIME ZONE
        },
        trancodes: {
            "SAVINGS_DEBIT": "258",//"251",
            "SAVINGS_CREDIT": "231",//"232",
            "SAVINGS_CREDIT_REGULAR": "231",//"232",
            "SAVINGS_CREDIT_PRINCIPAL": "231",
            "CHECKING_DEBIT": "158",//"151",
            "CHECKING_CREDIT": "130",//"132",
            "CHECKING_CREDIT_REGULAR": "130",//"132",
            "CHECKING_CREDIT_PRINCIPAL": "130",//"132",

            "LOAN_CREDIT_PRINCIPAL": "525",
            'REAL_ESTATE_LOAN_CREDIT_PRINCIPAL': "525",
            'INSTALLMENT_LOAN_CREDIT_PRINCIPAL': "525",
            'COMMERCIAL_LOAN_CREDIT_PRINCIPAL': "525",
            'CONSTRUCTION_LOAN_CREDIT_PRINCIPAL': "525",
            'RULE_OF_78_CREDIT_PRINCIPAL': "525",
            'USER_DEFINED_LOAN_CREDIT_PRINCIPAL': "525",

            "LOAN_CREDIT_REGULAR": "525",
            'REAL_ESTATE_LOAN_CREDIT_REGULAR': "525",
            'INSTALLMENT_LOAN_CREDIT_REGULAR': "525",
            'COMMERCIAL_LOAN_CREDIT_REGULAR': "525",
            'CONSTRUCTION_LOAN_CREDIT_REGULAR': "525",
            'RULE_OF_78_CREDIT_REGULAR': "525",
            'USER_DEFINED_LOAN_CREDIT_REGULAR': "525"
        },
        currency: {
            code: 'USD'//INR or USD
        },
        transactionMode: "MEMO_LEDGER",
        fundsTransferRemarksPrefix: "FUND TRANSFER ON ",

        /* Config for usage of default remarks for funds transfer : BEGIN */
        systemGenratedFundsTransferDescription : {
            isEnabled : true,
            maxLengthOfDefaultRemarks: 44,
            debitDescription : "To accoutTypeVerbiage accountNo", //accoutType, accoutTypeVerbiage, accountNo, maskedAccountNo, trimmedAccountNo,
            creditDescription : "From accoutTypeVerbiage accountNo",
            accoutTypeVerbiage : {
                "CHECKING" : "CHKG",
                "SAVINGS" :" SVGS",
                "LOANS" : "Loan",
                "REAL_ESTATE_LOAN" : "Loan",
                "INSTALLMENT_LOAN" : "Loan",
                "COMMERCIAL_LOAN" : "Loan",
                "USER_DEFINED_LOAN" : "Loan",
                "CONSTRUCTION_LOAN" : "Loan"
            }
        }, // enable or disable usage of default remarks
        customerDataInfoSendTo: 'vsoftomni1@gmail.com',//'rebekah.youngers@vsoftcorp.com',//',zubairhamid@cloudmpower.com,indrakumar.yanamala@vsoftcorp.com'
        checkOrder: {
            /* provider : Can be either OMNI or HARLAND or DELUXE */
            provider: 'OMNI',
            //   designOptions: ['Univ. Notre Dame Duplicate','Univ. of Tennessee','Univ. of Wis Duplicate',
            //              'Untamed Spirit','Victorian Rose','Vintage Passage','Wildlife','Wyland','Personal Deposit slip'], //Required  for Other Banks
            designOptions: ['Same as Prev. Order', 'Standard Point Bank', 'Other-Contact Bank'], //Required only for PB
            harland: {
                /* All the fields below are mandatory */
                logoUrl: 'http://192.168.1.86/imgs/white.jpg',
                bannerUrl1: 'http://192.168.1.86/imgs/white.jpg',
                bannerUrl2: 'http://192.168.1.86/imgs/white.jpg',
                bannerUrl3: 'http://192.168.1.86/imgs/white.jpg',
                interfaceUrl: 'http://192.168.2.211:8081/harland-interface/HarlandInterface',
                clientId: '00999'
            }
        },
        //Email Info
        mailerSetting: {
            auth: {
                user: 'kkumar@vsoftcorp.com',
                pass: 'Dhamupass1@'
            },
            host: "smtp.emailsrvr.com",
            port: 587,
            fromName: "IRIS OMNI",
            from: "no-reply@vsoftcorp.com",
            rejectUnauthorized: false
        },
        captcha: {
            client: {
                login: false,
                forgotPassword: false,
                forgotUsername: false
            },
            admin: {
                login: false
            }
        },
        moduleConfig: {
            client : {
                paymentsAndTransfers: {
                    payBills: true,
                    payOtherPeople: true,
                    transferMoneyInOtherFI: true,
                    transferMoneyInSameFI: true,
                    transferMoneyInSameFIThirdParty: false,
                    wireTransfer: true
                },
                checkCapture : {
                    deposit:true,
                    history:false
                },
                eStatements: {
                    view: true,
                    enroll: false
                },
                businessAndTransactionServices: {
                    billPay: false,
                    transferMoneyInSameFI: true,
                    transferMoneyInSameFIThirdParty: false,
                    achTransfer: true,
                    wireTransfer: true
                },
                otherServices: {
                    stopPayment: true,
                    orderChecks: true,
                    bankMail: true,
                    alerts: true
                },
                profileManagement: {
                    reminders: true
                },
                calculator : {
                    savings:true,
                    loan:true,
                    bond:true
                }
            },
            admin:{
                fiSecurity: {
                    changePassword: true,
                    fiUserPasswordRules: true,
                    fiAdminUser: true
                },
                customerSupport: {
                    customerOnBoarding: true,
                    userLoginSupport: true,
                    accountExclusion: true,
                    irisMail: true,
                    setupMailTemplate: true,
                    userActivityReport: true,
                    findUserDetails: true
                },
                fiPolicies: {
                    accessTypes: true,
                    customerUseridPasswordRules: true,
                    otpConfiguration: true,
                    transactionLimitProfile: true,
                    languageOptions: true,
                    siteCustomization: true
                },
                reports: {
                    downtimeReport: true,
                    inactiveUsers: true,
                    loginAttemptsReport: true,
                    pageHitsReport: true,
                    fundTransferReport: true,
                    reconciliationReport: true
                },
                fileProcessing: {
                    extractDownload: true,
                    showFileProcessingColumn: false
                }
            }
        },

        systemConfiguration: {
            client: {
                pagewiseConfig: {
                    accountActivitiesDetails: {
                        defaultRangeInMonth:2,//MUST BE LESS OR EQUAL OF historyDateRangeInMonth
                        historyDateMaxRangeInMonth: 12,
                        historyDateRangeInMonth: 2,
                        pageSize:50,//10,25,50,100
                        showSourceFilter: false,
                        showTransactionTypeFilter: false,
                        showCheckLink: false,
                        showRefernceColumn: true,
                        overview: {
                            showBranch: false
                        },
                        details: {
                            showAnnualPercYield: false,
                            showIntrestRate: false
                        },
                        tableType:{
                            loan : "type1" //default or type1
                        }
                    },
                    eStatements: {
                        statementDateMaxRangeInMonth: 12,
                        statementDateRangeInMonth: 2
                    },
                    eStatementsEnrollment: {
                        showSavingsAcc: true,
                        showCheckingsAcc: false,
                        showCDAcc: false,
                        showLoanAcc: false
                    },
                    fundTransfer: {
                        maxDaysAllowedForFutureTransfers: 30,
                        remarksLength: 44,
                        isThirdPartyTransferAvailableToSubuser : false,
                        loanPayType: {
                            regular: true,
                            principal: true,
                            curtailment: false,
                            loanPayoff: false,
                            interest: false,
                            lateCharge: false,
                            escrow: false
                        },
                        checkerMaker : false//TODO
                    },
                    wireTransfer: {
                        maxDaysAllowedForFutureTransfers: 10,
                        checkerMaker : true//TODO
                    },
                    achTransfer: {
                        maxDaysAllowedForFutureTransfers: 20,
                        checkerMaker : false//TODO
                    },
                    checkOrder: {
                        showSavingsAcc: true,
                        showCheckingsAcc: true,
                        showCDAcc: false,
                        showLoanAcc: false
                    },
                    checkCapture : {
                        showSavingsAcc:true,
                        showCheckingsAcc:true,
                        showCDAcc:false,
                        showLoanAcc:false,
                        maxNoOfCheck : 3
                    },
                    stopPay: {
                        showSavingsAcc: true,
                        showCheckingsAcc: true,
                        showCDAcc: false,
                        showLoanAcc: false,
                        overrideCheck: false,
                        stopPaymentRequirement: "BOTH"// AMOUNT, CHECK OR BOTH
                    },
                    alerts:{
                        module : {
                            Accounts : true,
                            User : true,
                            ACH : false,
                            WireTransfer : false
                        }
                    }

                }
            },
            admin: {
                pagewiseConfig: {
                    userLoginSupport: {
                        showResetPassword: true
                    },
                    reports: {
                        downtime: {
                            dateMaxRangeInMonth: 12,
                            dateRangeInMonth: 2
                        },
                        invalidLoginAttemptsReport: {
                            dateMaxRangeInMonth: 12,
                            dateRangeInMonth: 2
                        },
                        pageHitsReport: {
                            dateMaxRangeInMonth: 12,
                            dateRangeInMonth: 2
                        },
                        userWisePageHits: {
                            dateMaxRangeInMonth: 12,
                            dateRangeInMonth: 2
                        }
                    }/*,
                     fileProcessing: {
                     extractDownload: true
                     }*/
                }
            },
            restrictedCharSet: {
                charSet: '<>()\"/\*;={}`%+^![]',
                regex: '^([^\<\>\(\)\"\/\\\*\;\=\{\}\`\%\+\^\!\[\]])*$'
            }
        },
        secretQuestions: {
            "EN": {
                "secretQuestionsSet1": [
                    {
                        "SNo": "1",
                        "Question": "What was the name of the town your grandmother lived in?"
                    },
                    {
                        "SNo": "2",
                        "Question": "What was the last name of your favorite teacher in final year of high school?"
                    },
                    {
                        "SNo": "3",
                        "Question": "Where did you meet your spouse for the first time?"
                    },
                    {
                        "SNo": "4",
                        "Question": "In what city were you born?"
                    },
                    {
                        "SNo": "5",
                        "Question": "What was your favorite restaurant in college?"
                    },
                    {
                        "SNo": "6",
                        "Question": "What is your paternal grandfather’s first name?"
                    },
                    {
                        "SNo": "7",
                        "Question": "In What city was your mother born?"
                    }
                ],
                "secretQuestionsSet2": [
                    {
                        "SNo": "8",
                        "Question": "Where were you when you first heard about 9/11?"
                    },
                    {
                        "SNo": "9",
                        "Question": "What is your paternal grandmothers first name?"
                    },
                    {
                        "SNo": "10",
                        "Question": "What was the nickname of your grandfather?"
                    },
                    {
                        "SNo": "11",
                        "Question": "What was the name of your first stuffed animal?"
                    },
                    {
                        "SNo": "12",
                        "Question": "What was the name of your first pet?"
                    },
                    {
                        "SNo": "13",
                        "Question": "What is the first name of the best man at your wedding?"
                    },
                    {
                        "SNo": "14",
                        "Question": "What was your high school mascot?"
                    }
                ],
                "secretQuestionsSet3": [
                    {
                        "SNo": "15",
                        "Question": "What is your maternal grandfather’s first name?"
                    },
                    {
                        "SNo": "16",
                        "Question": "What is your best friend’s first name?"
                    },
                    {
                        "SNo": "17",
                        "Question": "What is your maternal grandmother’s first name?"
                    },
                    {
                        "SNo": "18",
                        "Question": "What is the middle name of your youngest child?"
                    },
                    {
                        "SNo": "19",
                        "Question": "What was the name of your High School?"
                    },
                    {
                        "SNo": "20",
                        "Question": "In what city were you married?"
                    },
                    {
                        "SNo": "21",
                        "Question": "In what city did you meet your spouse/significant other?"
                    }
                ],
                "secretQuestionsSet4": [
                    {
                        "SNo": "22",
                        "Question": "What is your mother’s middle name?"
                    },
                    {
                        "SNo": "23",
                        "Question": "What is the name of the camp you attended as a child?"
                    },
                    {
                        "SNo": "24",
                        "Question": "What is the color of your first car?"
                    },
                    {
                        "SNo": "25",
                        "Question": "What street did your best friend in high school live on?"
                    },
                    {
                        "SNo": "26",
                        "Question": "What was the name of your junior high school?"
                    },
                    {
                        "SNo": "27",
                        "Question": "In what city was your father born?"
                    },
                    {
                        "SNo": "28",
                        "Question": "What school did you attend for sixth grade?"
                    }
                ],
                "secretQuestionsSet5": [
                    {
                        "SNo": "29",
                        "Question": "In what city is your vacation home?"
                    },
                    {
                        "SNo": "30",
                        "Question": "What was the first name of your first manager?"
                    },
                    {
                        "SNo": "31",
                        "Question": "What is the first name of your oldest niece?"
                    },
                    {
                        "SNo": "32",
                        "Question": "What was the name of your first girlfriend/boyfriend?"
                    },
                    {
                        "SNo": "33",
                        "Question": "What is the first name of the maid of honor at your wedding?"
                    },
                    {
                        "SNo": "34",
                        "Question": "What is the first name of your oldest nephew?"
                    },
                    {
                        "SNo": "35",
                        "Question": "What is the name of the first company you worked for?"
                    },
                    {
                        "SNo": "36",
                        "Question": "In what city was your high school?"
                    },
                    {
                        "SNo": "37",
                        "Question": "What is your fathers middle name?"
                    }
                ]
            },
            "ES": {
                "secretQuestionsSet1": [
                    {
                        "SNo": "1",
                        "Question": "Cuál era la nombre de la ciudad a tu abuela vivía en?"
                    },
                    {
                        "SNo": "2",
                        "Question": "Cuál fue el último nombre de su profesor favorito en último año de la escuela secundaria?"
                    },
                    {
                        "SNo": "3",
                        "Question": "Dónde conociste a tu pareja por primera vez?"
                    },
                    {
                        "SNo": "4",
                        "Question": "En qué ciudad naciste?"
                    },
                    {
                        "SNo": "5",
                        "Question": "Cuál fue su restaurante favorito en la universidad?"
                    },
                    {
                        "SNo": "6",
                        "Question": "Cuál es el nombre de su abuelo paterno?"
                    },
                    {
                        "SNo": "7",
                        "Question": "En qué ciudad nació su madre?"
                    }
                ],
                "secretQuestionsSet2": [
                    {
                        "SNo": "8",
                        "Question": "Dónde estabas cuando te enteraste sobre 9/11?"
                    },
                    {
                        "SNo": "9",
                        "Question": "Cuál es tu abuelas paternas nombre?"
                    },
                    {
                        "SNo": "10",
                        "Question": "Lo que era el apodo de tu abuelo?"
                    },
                    {
                        "SNo": "11",
                        "Question": "Cuál era el nombre de su primer animal de peluche?"
                    },
                    {
                        "SNo": "12",
                        "Question": "Cuál fué el nombre de tu primera mascota?"
                    },
                    {
                        "SNo": "13",
                        "Question": "Cuál es el nombre del padrino de su boda?"
                    },
                    {
                        "SNo": "14",
                        "Question": "Cuál fue su alta mascota de la escuela?"
                    }
                ],
                "secretQuestionsSet3": [
                    {
                        "SNo": "15",
                        "Question": "Cuál es el nombre de su abuelo materno?"
                    },
                    {
                        "SNo": "16",
                        "Question": "Cuál es el primer nombre de tu mejor amigo?"
                    },
                    {
                        "SNo": "17",
                        "Question": "Cuál es el nombre de su abuela materna?"
                    },
                    {
                        "SNo": "18",
                        "Question": "Cuál es el segundo nombre de su hijo menor?"
                    },
                    {
                        "SNo": "19",
                        "Question": "Cuál era el nombre de su escuela secundaria?"
                    },
                    {
                        "SNo": "20",
                        "Question": "En qué ciudad estabas casado?"
                    },
                    {
                        "SNo": "21",
                        "Question": "En qué ciudad se conocieron otra su cónyuge / pareja?"
                    }
                ],
                "secretQuestionsSet4": [
                    {
                        "SNo": "22",
                        "Question": "Cuál es el segundo nombre de su madre?"
                    },
                    {
                        "SNo": "23",
                        "Question": "Cuál es el nombre del campo que asistió cuando era niño?"
                    },
                    {
                        "SNo": "24",
                        "Question": "Cuál es el color de tu primer coche?"
                    },
                    {
                        "SNo": "25",
                        "Question": "En qué calle se tu mejor amigo en la escuela secundaria viven en?"
                    },
                    {
                        "SNo": "26",
                        "Question": "Cuál era el nombre de su escuela secundaria?"
                    },
                    {
                        "SNo": "27",
                        "Question": "En qué ciudad nació su padre?"
                    },
                    {
                        "SNo": "28",
                        "Question": "Qué escuela fue usted asiste a sexto grado?"
                    }
                ],
                "secretQuestionsSet5": [
                    {
                        "SNo": "29",
                        "Question": "En qué ciudad es su casa de vacaciones?"
                    },
                    {
                        "SNo": "30",
                        "Question": "Cuál fue el primer nombre de su primer gerente?"
                    },
                    {
                        "SNo": "31",
                        "Question": "Cuál es el primer nombre de su sobrina mayor?"
                    },
                    {
                        "SNo": "32",
                        "Question": "Cuál era el nombre de su primera novia / novio?"
                    },
                    {
                        "SNo": "33",
                        "Question": "Cuál es el primer nombre de la dama de honor en su boda?"
                    },
                    {
                        "SNo": "34",
                        "Question": "Cuál es el primer nombre de su sobrino mayor?"
                    },
                    {
                        "SNo": "35",
                        "Question": "Cuál es el nombre de la primera empresa que trabajó para?"
                    },
                    {
                        "SNo": "36",
                        "Question": "En qué ciudad era su escuela secundaria?"
                    },
                    {
                        "SNo": "37",
                        "Question": "Cuál es el segundo nombre de tu padre?"
                    }
                ]
            }

        }
    }
    ;
})
();
