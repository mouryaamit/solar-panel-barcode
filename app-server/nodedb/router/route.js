(function () {
    "use strict";

    var _ = require('underscore');

    var jwt = require('jsonwebtoken');

    var jsSHA = require("jssha");

    var handleSession = require('../lib/prop/session');

    var accessHandler = require('../lib/prop/checkViewAccess');

    var globalConn = require('../lib/prop/globalConnObj');

    var clientInit = require('../api/clientInit');
    var adminInit = require('../api/adminInit');
    var pageHit = require('../api/pageHitApi');
    var customerInquiry = require('../api/customerInquiryApi');
    var adminCustomerInquiry = require('../api/adminCustomerInquiryApi');
    var customerAccounts = require('../api/customerAllAccountsApi');
    var getContactDetailsForUser = require('../api/userApi/getContactDetailsForUserApi');
    var bondCalculator = require('../api/bondCalculatorApi');
    var checkImages = require('../api/checkImagesApi');
    var accountInquiry = require('../api/accountInquiryApi');
    var transactionInquiry = require('../api/transactionInquiryApi');
    var fundsTransfer = require('../api/fundsTransferApi');
    var fundsTransferLogs = require('../api/fundsTransferLogsApi');
    var editFundsTransfer = require('../api/editFundsTransferApi');
    var deleteFundsTransfer = require('../api/deleteFundsTransferApi');
    var pendingTransfer = require('../api/pendingTransferApi');
    var statementDownload = require('../api/statementDownloadApi');
    var statementFile = require('../api/statementFileApi');
    var getStatementFile = require('../api/getStatementFileApi');
    var login = require('../api/userApi/loginApi');
    var firstTimeLogin = require('../api/userApi/firstLoginChangeApi');
    var addNewQuestionsAtLogin = require('../api/userApi/addNewQuestionsAtLoginApi');
    var logout = require('../api/userApi/logoutApi');
    var payveris = require('../api/payveriSessionApi');
    var mx = require('../api/mxSessionApi');

    var createBatch = require('../api/batchApi/createBatchApi');
    var processACHBatch = require('../api/batchApi/processACHBatchApi');
    var reinitiateACHBatch = require('../api/batchApi/reinitiateACHBatchApi');
    var updateBatch = require('../api/batchApi/updateBatchApi');
    var removeBatch = require('../api/batchApi/removeBatchApi');
    var createBatchRecipient = require('../api/batchApi/createBatchRecipientApi');
    var updateRecipient = require('../api/batchApi/updateRecipientApi');
    var removeRecipient = require('../api/batchApi/removeRecipientApi');
    var excludeRecipient = require('../api/batchApi/excludeRecipientApi');
    var includeRecipient = require('../api/batchApi/includeRecipientApi');
    var authorizeBatch = require('../api/batchApi/batchAuthorizeApi');
    var deAuthorizeBatch = require('../api/batchApi/batchDeAuthorizeApi');
    var allBatch = require('../api/batchApi/listAllBatchApi');
    var pendingBatch = require('../api/batchApi/listPendingBatchApi');
    var editableBatch = require('../api/batchApi/listEditableBatchApi');
    var batchRecipient = require('../api/batchApi/listBatchRecipientApi');
    var batchDetail = require('../api/batchApi/batchDetailApi');
    var routingNumber = require('../api/batchApi/findRoutingNumberApi');

    var uploadAchFile = require('../api/batchApi/uploadACHFileApi');
    var listAchFile = require('../api/batchApi/listUploadACHFileApi');
    var listAchFileBatch = require('../api/batchApi/listFileBatchApi');
    var batchProcessAch = require('../api/batchApi/processBatchACHFileApi');
    var batchRemoveAch = require('../api/batchApi/removeBatchACHFileApi');


    var directEnroll = require('../api/userApi/directAddUserApi');
    var enrollUser = require('../api/userApi/enrollUserApi');
    var changeSQ = require('../api/userApi/changeSecurityQuestionApi');
    var checkAvailability = require('../api/userApi/checkUserAvailabilityApi');
    var changeUP = require('../api/userApi/changePasswordApi');
    var changePI = require('../api/userApi/changePersonalInfoApi');
    var listUserSQ = require('../api/userApi/listUserSecurityQuestionApi');
    var listUserAllSQ = require('../api/userApi/listUserAllSQApi');
    var verifyUserSQ = require('../api/userApi/verifySecurityQuestionApi');

    var verifyEmailId = require('../api/userApi/verifyEmailIdApi');

    var MFAUserSQ = require('../api/userApi/mfaQuestionApi');
    var verifyMFASQ = require('../api/userApi/verifyMFAQuestionApi');

    var listSecurityQuestion = require('../api/userApi/listSecurityQuestionApi');

    /*REMINDER API REQUIRE*/
    var addReminder = require('../api/userApi/reminderApi/addReminderApi');
    var showReminder = require('../api/userApi/reminderApi/showRemindersApi');
    var listReminder = require('../api/userApi/reminderApi/listRemindersApi');
    var editReminder = require('../api/userApi/reminderApi/editReminderApi');
    var deleteReminder = require('../api/userApi/reminderApi/deleteRemindersApi');

    /*ALERT API REQUIRE*/
    var addAlert = require('../api/userApi/alertsApi/addAlertApi');
    var editAlert = require('../api/userApi/alertsApi/editAlertApi');
    var listAlert = require('../api/userApi/alertsApi/listAlertsApi');
    var enrollmentsList = require('../api/userApi/enrollmentsListApi/enrollmentsListApi');
    var deleteAlert = require('../api/userApi/alertsApi/deleteAlertApi');
    var deEnrollAccountNumbers = require('../api/userApi/deEnrollAccountNumbersApi');

    /*WIRE TRANSFER API REQUIRE*/
    var addBeneficiary = require('../api/userApi/wireTransferApi/addBeneficiaryApi');
    var addWireTransfer = require('../api/userApi/wireTransferApi/addWireTransferApi');
    var editBeneficiary = require('../api/userApi/wireTransferApi/editBeneficiaryApi');
    var deleteBeneficiary = require('../api/userApi/wireTransferApi/deleteBeneficiaryApi');
    var listBeneficiary = require('../api/userApi/wireTransferApi/listBeneficiaryApi');
    var listWireTransfer = require('../api/userApi/wireTransferApi/listWireTransferApi');
    var authorizeWireTransfer = require('../api/userApi/wireTransferApi/authorizeWireTransferApi');
    var deleteWireTransfer = require('../api/userApi/wireTransferApi/deleteWireTransferApi');

    /*THIRD PARTY TRANSFER API REQUIRE*/
    var addThirdPartyBeneficiary = require('../api/userApi/thirdPartyTransferApi/addThirdPartyBeneficiaryApi');
    var editThirdPartyBeneficiary = require('../api/userApi/thirdPartyTransferApi/editThirdPartyBeneficiaryApi');
    var deleteThirdPartyBeneficiary = require('../api/userApi/thirdPartyTransferApi/deleteThirdPartyBeneficiaryApi');
    var deletePendingThirdPartyBeneficiary = require('../api/userApi/thirdPartyTransferApi/deletePendingThirdPartyBeneficiaryApi');
    var listThirdPartyBeneficiary = require('../api/userApi/thirdPartyTransferApi/listThirdPartyBeneficiaryApi');

    /*StopPayment API REQUIRE*/
    var addPayment = require('../api/userApi/paymentApi/addStopPaymentApi');
    var listPayment = require('../api/userApi/paymentApi/listStopPaymentApi');
    var deletePayment = require('../api/userApi/paymentApi/deleteStopPaymentApi');

    /*OrderCheck API REQUIRE*/
    var orderCheck = require('../api/userApi/orderCheckApi/requestCheckApi');

    var statementsEnrollment = require('../api/userApi/statementsEnrollmentApi/statementsEnrollmentApi');

    /*SUPERVISOR API REQUIRE*/
    var addBYSupervisor = require('../api/supervisorApi/enrollUserApi');
    var updateBYSupervisor = require('../api/supervisorApi/updateUserApi');
    var listSCreatedUser = require('../api/supervisorApi/listCreatedUserApi');
    var changeUTL = require('../api/supervisorApi/changeUserTransactionLimitApi');
    var changeUAA = require('../api/supervisorApi/changeUserAccountAccessApi');
    var changeSUP = require('../api/supervisorApi/changeUserProfileApi');
    var changeUVA = require('../api/supervisorApi/changeUserViewAccessApi');
    var changeUSQ = require('../api/supervisorApi/changeUserSecurityQuestionApi');
    var deleteUser = require('../api/supervisorApi/deleteUserApi');
    var reactivateUser = require('../api/userApi/reactivateUserApi');
    var eodExtractDownload = require('../api/eodExtractDownloadApi');

    /*BANK ADMIN API REQUIRE*/
    var createBankAdmin = require('../api/bankAdminApi/createBankAdminApi');
    var overrideAccessType = require('../api/bankAdminApi/overrideAccessTypeApi');
    var listBankAdmin = require('../api/bankAdminApi/listAllAdminApi');
    var editBankAdmin = require('../api/bankAdminApi/editBankAdminApi');
    var changeStatusBankAdmin = require('../api/bankAdminApi/changeStatusBankAdminApi');
    var listAdminSecurityQ = require('../api/bankAdminApi/listAdminSecurityQApi');
    var MFAadminSQ = require('../api/bankAdminApi/mfaAdminSQApi');
    var adminFirstLogin = require('../api/bankAdminApi/adminFirstLoginApi');
    var resetSecurityQuestAdmin = require('../api/bankAdminApi/resetSecurityQuestAdminApi');
    var verifyMFAadminSQ = require('../api/bankAdminApi/verifyMFAadminSQApi');
    var listAdminAllSQ = require('../api/bankAdminApi/listAdminAllSQApi');
    var addAdminNewQuestionsAtLogin = require('../api/bankAdminApi/addAdminNewQuestionsAtLoginApi');
    var changeAdminSQ = require('../api/bankAdminApi/changeAdminSQApi');
    var resetPasswordBankAdmin = require('../api/bankAdminApi/resetPasswordBankAdminApi');
    var bankAdminChangePassword = require('../api/bankAdminApi/changePasswordApi');
    var bankAdminAvailability = require('../api/bankAdminApi/checkAvailabilityApi');
    var addBankPolicy = require('../api/bankAdminApi/addBankPolicyApi');
    var changeBankPolicy = require('../api/bankAdminApi/changeBankPolicyApi');
    var getBankPolicy = require('../api/bankAdminApi/showBankPolicyApi');
    var searchCustomer = require('../api/bankAdminApi/customerSearchApi');
    var exclusionSearchCustomer = require('../api/bankAdminApi/exclusionCustomerSearchApi');
    var accExclusionForCustomer = require('../api/bankAdminApi/accExclusionForCustomerApi');
    var bankAdminLogin = require('../api/bankAdminApi/loginApi');
    var bankAdminLogout = require('../api/bankAdminApi/logoutApi');
    var addAccessTypes = require('../api/bankAdminApi/createAccessTypeApi');
    var editAccessType = require('../api/bankAdminApi/editAccessTypeApi');
    var listAccessTypes = require('../api/bankAdminApi/listAllAccessTypeApi');
    var listLockedUser = require('../api/bankAdminApi/lockedUserListApi');
    var unLockUser = require('../api/bankAdminApi/unLockUserApi');
    var inActiveUser = require('../api/bankAdminApi/inActiveUsersApi');
    var activeUser = require('../api/bankAdminApi/activeUsersApi');
    var findUser = require('../api/bankAdminApi/findUserApi');
    var resetPassword = require('../api/bankAdminApi/resetPasswordApi');
    var resetSecurityQ = require('../api/bankAdminApi/resetSecurityQApi');
    var inValidLogin = require('../api/bankAdminApi/inValidLoginReportApi');
    var sessionReport = require('../api/bankAdminApi/sessionsReportApi');
    var downTimeReport = require('../api/bankAdminApi/downTimeReportApi');
    var userActivityReport = require('../api/bankAdminApi/userActivityReportApi');
    var clientActivityReport = require('../api/bankAdminApi/clientActivityReportApi');
    var reconciliationUsersReport = require('../api/bankAdminApi/reconciliationUsersReportApi');
    var addBankPasswordRule = require('../api/bankAdminApi/addBankPasswordRuleApi');
    var changeBankPasswordRule = require('../api/bankAdminApi/changeBankPasswordRuleApi');
    var getBankPasswordRule = require('../api/bankAdminApi/showBankPasswordRuleApi');
    var getMailWording = require('../api/bankAdminApi/getMailWordingApi');
    var addMailWording = require('../api/bankAdminApi/addMailWordingApi');
    var editMailWording = require('../api/bankAdminApi/editMailWordingApi');
    var printUserIdTemplate = require('../api/bankAdminApi/printUserIdTemplateApi');
    var printPasswordTemplate = require('../api/bankAdminApi/printPasswordTemplateApi');
    var uploadSiteImage = require('../api/bankAdminApi/siteCustomisationApi/uploadImageFileApi');
    var deleteSiteImage = require('../api/bankAdminApi/siteCustomisationApi/deleteImageFileApi');
    var listSiteImage = require('../api/bankAdminApi/siteCustomisationApi/listImageFileApi');
    var applySiteChange = require('../api/bankAdminApi/siteCustomisationApi/applySiteChangesApi');
    var applySiteOverviewChanges = require('../api/bankAdminApi/siteCustomisationApi/applySiteOverviewChangesApi');
    var updateSiteLanguage = require('../api/bankAdminApi/multiLingualApi/updateLanguageSetApi');
    var listSiteLanguage = require('../api/bankAdminApi/multiLingualApi/listLanguageSetApi');

    /*PageHits*/
    var pageHitOverview = require('../api/bankAdminApi/pageHitOverviewApi');
    var pageHitPage = require('../api/bankAdminApi/pageHitPageReportApi');
    var pageHitCustomer = require('../api/bankAdminApi/pageHitCustomerReportApi');

    var fileDownload = require('../api/fileDownloadApi');
    var getFile = require('../api/getFileApi');

    /*Admin Mail Api*/
    var sendEmailFromAdmin = require('../api/bankAdminApi/bankMailApi/sendMailToUserApi');
    var listAdminInbox = require('../api/bankAdminApi/bankMailApi/listInboxApi');
    var listAdminSentBox = require('../api/bankAdminApi/bankMailApi/listSentToApi');
    var listAdminTrashBox = require('../api/bankAdminApi/bankMailApi/listTrashApi');
    var adminMailToTrashBox = require('../api/bankAdminApi/bankMailApi/moveToTrashApi');
    var adminMailReply = require('../api/bankAdminApi/bankMailApi/mailReplyApi');
    var adminMailRead = require('../api/bankAdminApi/bankMailApi/markMailAsReadApi');
    var adminMailDelete = require('../api/bankAdminApi/bankMailApi/deleteFromTrashApi');


    /*User Mail Api*/
    var sendEmailFromUser = require('../api/userApi/userMailApi/sendMailToAdminApi');
    var listUserInbox = require('../api/userApi/userMailApi/listInboxApi');
    var listUserSentBox = require('../api/userApi/userMailApi/listSentToApi');
    var listUserTrashBox = require('../api/userApi/userMailApi/listTrashApi');
    var userMailToTrashBox = require('../api/userApi/userMailApi/moveToTrashApi');
    var userMailReply = require('../api/userApi/userMailApi/mailReplyApi');
    var userMailRead = require('../api/userApi/userMailApi/markMailAsReadApi');
    var userMailDelete = require('../api/userApi/userMailApi/deleteFromTrashApi');

    //OTP Require
    var otpHandler = require('../api/otpApi/otpHandlerApi');
    var forgotPasswordOtp = require('../api/otpApi/forgotPasswordOTPApi');
    var validateOtp = require('../api/otpApi/validateOtpApi');

    var updateOtpConfig = require('../api/otpApi/updateOtpConfigApi');
    var showOtpConfig = require('../api/otpApi/showOtpConfigApi');

    var otpConfigHandler = require('../apiMethods/otpConfigurationMethods');

    var updateNickName = require('../api/userApi/updateNickNameApi')

    //Limit Profile
    var limitProfileNew = require('../api/limitProfileApi/limitProfileNewApi')
    var limitProfileEdit = require('../api/limitProfileApi/limitProfileEditApi')
    var limitProfileDelete = require('../api/limitProfileApi/limitProfileDeleteApi')
    var limitProfilesList = require('../api/limitProfileApi/limitProfilesListApi')
    var limitProfileUsersList = require('../api/limitProfileApi/limitProfileUsersListApi')
    var overrideLimitProfileForUser = require('../api/limitProfileApi/overrideLimitProfileForUserApi')

    //Customer Onboarding
    var customerSearch = require('../api/customerSearchApi')
    var enrollAndPrint = require('../api/bankAdminApi/customerOnboardingApi/branchOnboardingApi/enrollAndPrintApi')
    var enrollAndMail = require('../api/bankAdminApi/customerOnboardingApi/branchOnboardingApi/enrollAndMailApi')
    var desiredEnroll = require('../api/bankAdminApi/customerOnboardingApi/branchOnboardingApi/desiredEnrollApi')

    var generateCaptcha = require('../api/generateCaptchaApi')

    //Check Capute
    var checkDepositHistroy = require('../api/checkCapture/checkDepositHistroyApi')
    var deleteCheck = require('../api/checkCapture/deleteCheckApi')
    var deleteDeposit = require('../api/checkCapture/deleteDepositApi')
    var depositCheck = require('../api/checkCapture/depositCheckApi')
    var depositTransmit = require('../api/checkCapture/depositTransmitApi')

    //User Limits
    var userLimits = require('../api/userApi/userLimitsApi')


    module.exports.apiCalls = {
        pageHit                             : 'pageHit',
        fileDownload                        : 'fileDownload',
        getFile                        : 'getFile',
        overrideaccesstype                 : 'overrideaccesstype',
        transactionDownload                 : 'transactionDownload',
        uploadSiteImage                     : 'uploadSiteImage',
        deleteSiteImage                     : 'deleteSiteImage',
        listSiteImage                       : 'listSiteImage',
        applySiteChange                     : 'applySiteChange',
        applySiteOverviewChanges                     : 'applySiteOverviewChanges',
        printUserIdTemplate                 : 'printUserIdTemplate',
        printPasswordTemplate               : 'printPasswordTemplate',
        getMailWording                      : 'getMailWording',
        addMailWording                      : 'addMailWording',
        editMailWording                     : 'editMailWording',
        pageHitOverview                     : 'pageHitOverview',
        pageHitPage                         : 'pageHitPage',
        pageHitCustomer                     : 'pageHitCustomer',
        sendEmailFromAdmin                  : 'sendEmailFromAdmin',
        listAdminInbox                      : 'listAdminInbox',
        listAdminSentBox                    : 'listAdminSentBox',
        listAdminTrashBox                   : 'listAdminTrashBox',
        adminMailToTrashBox                 : 'adminMailToTrashBox',
        adminMailReply                      : 'adminMailReply',
        adminMailRead                       : 'adminMailRead',
        adminMailDelete                     : 'adminMailDelete',
        sendEmailFromUser                   : 'sendEmailFromUser',
        listUserInbox                       : 'listUserInbox',
        listUserSentBox                     : 'listUserSentBox',
        listUserTrashBox                    : 'listUserTrashBox',
        userMailToTrashBox                  : 'userMailToTrashBox',
        userMailReply                       : 'userMailReply',
        userMailRead                        : 'userMailRead',
        userMailDelete                      : 'userMailDelete',
        resetPassword                       : 'resetPassword',
        resetSecurityQ                       : 'resetSecurityQ',
        addBankPolicy                       : 'addBankPolicy',
        listBankAdmin                       : 'listBankAdmin',
        createBankAdmin                     : 'createBankAdmin',
        editBankAdmin                       : 'editBankAdmin',
        changeStatusBankAdmin               : 'changeStatusBankAdmin',
        MFAadminSQ                          : 'MFAadminSQ',
        adminFirstLogin                     : 'adminFirstLogin',
        resetSecurityQuestAdmin                     : 'resetSecurityQuestAdmin',
        verifyMFAadminSQ                    : 'verifyMFAadminSQ',
        listAdminSecurityQ                  : 'listAdminSecurityQ',
        listAdminAllSQ                      : 'listAdminAllSQ',
        addAdminNewQuestionsAtLogin                      : 'addAdminNewQuestionsAtLogin',
        changeAdminSQ                      : 'changeAdminSQ',
        resetPasswordBankAdmin                       : 'resetPasswordBankAdmin',
        bankAdminAvailability               : 'bankAdminAvailability',
        bankAdminChangePassword             : 'bankAdminChangePassword',
        addBankPasswordRule                 : 'addBankPasswordRule',
        getBankPasswordRule                 : 'getBankPasswordRule',
        changeBankPasswordRule              : 'changeBankPasswordRule',
        sessionReport                       : 'sessionReport',
        downTimeReport                      : 'downTimeReport',
        userActivityReport                  : 'userActivityReport',
        clientActivityReport                : 'clientActivityReport',
        reconciliationUsersReport           : 'reconciliationUsersReport',
        inValidLogin                        : 'inValidLogin',
        changeBankPolicy                    : 'changeBankPolicy',
        getBankPolicy                       : 'getBankPolicy',
        addBYSupervisor                     : 'addBYSupervisor',
        updateBYSupervisor                     : 'updateBYSupervisor',
        listSCreatedUser                    : 'listSCreatedUser',
        searchCustomer                      : 'searchCustomer',
        exclusionSearchCustomer             : 'exclusionSearchCustomer',
        accExclusionForCustomer             : 'accExclusionForCustomer',
        changeUTL                           : 'changeUTL',
        changeSUP                           : 'changeSUP',
        changeUAA                           : 'changeUAA',
        changeUVA                           : 'changeUVA',
        changeUSQ                           : 'changeUSQ',
        deleteUser                          : 'deleteUser',
        deleteUserByAdmin                   : 'deleteUserByAdmin',
        bankAdminLogin                      : 'bankAdminLogin',
        bankAdminLogout                     : 'bankAdminLogout',
        checkAvailability                   : 'checkAvailability',
        listSecurityQ                       : 'listSecurityQ',
        listLockedUser                      : 'listLockedUser',
        unLockUser                          : 'unLockUser',
        inActiveUser                        : 'inActiveUser',
        activeUser                          : 'activeUser',
        findUser                            : 'findUser',
        unLockBySupervisor                  : 'unLockBySupervisor',
        listAccessTypes                     : 'listAccessTypes',
        addAccessTypes                      : 'addAccessTypes',
        editAccessType                      : 'editAccessType',
        login                               : 'login',
        listUserSQ                          : 'listUserSQ',
        listUserAllSQ                       : 'listUserAllSQ',
        verifyUserSQ                        : 'verifyUserSQ',
        verifyEmailId                       : 'verifyEmailId',
        firstTimeLogin                      : 'firstTimeLogin',
        addNewQuestionsAtLogin              : 'addNewQuestionsAtLogin',
        MFAUserSQ                           : 'MFAUserSQ',
        verifyMFASQ                         : 'verifyMFASQ',
        payveris                            : 'payveris',
        mx                                  : 'mx',
        logout                              : 'logout',
        customerInquiry                     : 'customerInquiry',
        adminCustomerInquiry                : 'adminCustomerInquiry',
        bondCalculator                      : 'bondCalculator',
        checkImages                         : 'checkImages',
        customerAccounts                    : 'customerAccounts',
        accountInquiry                      : 'accountInquiry',
        statementDownload                   : 'statementDownload',
        statementFile                       : 'statementFile',
        getStatementFile                       : 'getStatementFile',
        transactionInquiry                  : 'transactionInquiry',
        fundsTransfer                       : 'fundsTransfer',
        fundsTransferLogs                       : 'fundsTransferLogs',
        editFundsTransfer                   : 'editFundsTransfer',
        deleteFundsTransfer                 : 'deleteFundsTransfer',
        pendingTransfer                     : 'pendingTransfer',
        createBatch                         : 'createBatch',
        updateBatch                         : 'updateBatch',
        removeBatch                         : 'removeBatch',
        createBatchRecipient                : 'createBatchRecipient',
        updateRecipient                     : 'updateRecipient',
        removeRecipient                     : 'removeRecipient',
        excludeRecipient                    : 'excludeRecipient',
        includeRecipient                    : 'includeRecipient',
        authorizeBatch                      : 'authorizeBatch',
        deAuthorizeBatch                    : 'deAuthorizeBatch',
        allBatch                            : 'allBatch',
        pendingBatch                        : 'pendingBatch',
        editableBatch                       : 'editableBatch',
        batchRecipient                      : 'batchRecipient',
        batchDetail                         : 'batchDetail',
        uploadAchFile                       : 'uploadAchFile',
        listAchFile                         : 'listAchFile',
        listAchFileBatch                    : 'listAchFileBatch',
        batchProcessAch                     : 'batchProcessAch',
        batchRemoveAch                      : 'batchRemoveAch',
        clientInit                               : 'clientInit',
        adminInit                               : 'adminInit',
        keepAlive                           : 'keepAlive',
        directEnroll                        : 'directEnroll',
        enrollUser                          : 'enrollUser',
        changeSQ                            : 'changeSQ',
        changeUP                            : 'changeUP',
        changePI                            : 'changePI',
        routingNumber                       : 'routingNumber',
        addReminder                         : 'addReminder',
        editReminder                        : 'editReminder',
        deleteReminder                      : 'deleteReminder',
        showReminder                        : 'showReminder',
        listReminder                        : 'listReminder',
        addPayment                          : 'addPayment',
        listPayment                         : 'listPayment',
        deletePayment                         : 'deletePayment',
        addAlert                            : 'addAlert',
        editAlert                           : 'editAlert',
        deleteAlert                         : 'deleteAlert',
        deEnrollAccountNumbers              : 'deEnrollAccountNumbers',
        listAlert                           : 'listAlert',
        enrollmentsList                     : 'enrollmentsList',
        addBeneficiary                      : 'addBeneficiary',
        addThirdPartyBeneficiary            : 'addThirdPartyBeneficiary',
        editBeneficiary                     : 'editBeneficiary',
        deleteBeneficiary                   : 'deleteBeneficiary',
        listBeneficiary                     : 'listBeneficiary',
        editThirdPartyBeneficiary                     : 'editThirdPartyBeneficiary',
        deleteThirdPartyBeneficiary                   : 'deleteThirdPartyBeneficiary',
        deletePendingThirdPartyBeneficiary                   : 'deletePendingThirdPartyBeneficiary',
        listThirdPartyBeneficiary                     : 'listThirdPartyBeneficiary',
        addWireTransfer                     : 'addWireTransfer',
        listWireTransfer                    : 'listWireTransfer',
        authorizeWireTransfer               : 'authorizeWireTransfer',
        deleteWireTransfer                  : 'deleteWireTransfer',
        orderCheck                          : 'orderCheck',
        updateSiteLanguage                  : 'updateSiteLanguage',
        listSiteLanguage                    : 'listSiteLanguage',
        updateNickName                      : 'updateNickName',
        updateOtpConfig                     : 'updateOtpConfig',
        showOtpConfig                       : 'showOtpConfig',
        validateOtp                         : 'validateOtp',
        forgotPasswordOtp                   : 'forgotPasswordOtp',
        otpHandler                          : 'otpHandler',
        statementsEnrollment                : 'statementsEnrollment',
        limitProfileNew                     : 'limitProfileNew',
        limitProfileEdit                    : 'limitProfileEdit',
        limitProfileDelete                   : 'limitProfileDelete',
        limitProfilesList                   : 'limitProfilesList',
        limitProfileUsersList               : 'limitProfileUsersList',
        overrideLimitProfileForUser               : 'overrideLimitProfileForUser',
        customerSearch               : 'customerSearch',
        enrollAndPrint               : 'enrollAndPrint',
        enrollAndMail              : 'enrollAndMail',
        desiredEnroll              : 'desiredEnroll',
        reactivateUser              : 'reactivateUser',
        eodExtractDownload              : 'eodExtractDownload',
        generateCaptcha              : 'generateCaptcha',
        getContactDetailsForUser              : 'getContactDetailsForUser',
        depositCheck:'depositCheck',
        deleteDeposit:'deleteDeposit',
        deleteCheck:'deleteCheck',
        depositTransmit:'depositTransmit',
        checkDepositHistroy:'checkDepositHistroy',
        processACHBatch              : 'processACHBatch',
        reinitiateACHBatch              : 'reinitiateACHBatch',
        userLimits              : 'userLimits'
    };

    function Route(app , rin) {
        var routes = [
            {
                api                 : 'clientInit',
                isEncrypted         : false,
                func                : clientInit.clientInitApi
            },
            {
                api                 : 'adminInit',
                isEncrypted         : false,
                func                : adminInit.adminInitApi
            },
            {
                api                 : 'generateCaptcha',
                isEncrypted         : false,
                func                : generateCaptcha.generateCaptchaApi
            },
            {
                api                 : 'pageHit',
                isEncrypted         : true,
                inSession           : true,
                func                : pageHit.pageHitApi,
                contentType         : 'application/json'
            },
            {
                api                 : 'keepAlive',
                isEncrypted         : true,
                inSession           : true,
                func                : adminInit.adminInitApi
            },
            {
                api                 : 'fileDownload',
                isEncrypted         : true,
                func                : fileDownload.fileDownloadApi,
                contentType         : 'application/json'
            },

            {
                api                 : 'getFile',
                func                : getFile.getFileApi
            },
            {
                api                 : 'transactionDownload',
                isEncrypted         : true,
                inSession           : true,
                func                : fileDownload.fileDownloadApi,
                viewPerm            : 'Accounts.DetailsHistory',
                contentType         : 'application/json'
            },
            {
                api                 : 'overrideaccesstype',
                isEncrypted         : true,
                inSession           : true,
                func                : overrideAccessType.overrideAccessTypeApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'uploadSiteImage',
                isEncrypted         : true,
                inSession           : true,
                func                : uploadSiteImage.uploadSiteImageApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'deleteSiteImage',
                isEncrypted         : true,
                inSession           : true,
                func                : deleteSiteImage.deleteSiteImageApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listSiteImage',
                isEncrypted         : true,
                inSession           : true,
                func                : listSiteImage.listSiteImageApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'applySiteChange',
                isEncrypted         : true,
                inSession           : true,
                func                : applySiteChange.applySiteChangeApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'applySiteOverviewChanges',
                isEncrypted         : true,
                inSession           : true,
                func                : applySiteOverviewChanges.applySiteOverviewChangeApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'updateSiteLanguage',
                isEncrypted         : true,
                inSession           : true,
                func                : updateSiteLanguage.updateLanguageSetApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listSiteLanguage',
                func                : listSiteLanguage.listLanguageSetApi,
                contentType         : 'application/json'
            },
            {
                api                 : 'pageHitOverview',
                isEncrypted         : true,
                inSession           : true,
                func                : pageHitOverview.pageHitOverviewReportApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'pageHitPage',
                isEncrypted         : true,
                inSession           : true,
                func                : pageHitPage.pageHitPageReportApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'pageHitCustomer',
                isEncrypted         : true,
                inSession           : true,
                func                : pageHitCustomer.pageHitCustomerReportApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'resetPassword',
                isEncrypted         : true,
                inSession           : true,
                func                : resetPassword.resetPasswordApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'resetSecurityQ',
                isEncrypted         : true,
                inSession           : true,
                func                : resetSecurityQ.resetSecurityQApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'sendEmailFromAdmin',
                isEncrypted         : true,
                inSession           : true,
                func                : sendEmailFromAdmin.mailToUserApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listAdminInbox',
                isEncrypted         : true,
                inSession           : true,
                func                : listAdminInbox.adminMailInboxApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listAdminSentBox',
                isEncrypted         : true,
                inSession           : true,
                func                : listAdminSentBox.adminMailSentApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listAdminTrashBox',
                isEncrypted         : true,
                inSession           : true,
                func                : listAdminTrashBox.adminMailTrashApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'adminMailToTrashBox',
                isEncrypted         : true,
                inSession           : true,
                func                : adminMailToTrashBox.adminMailToTrashApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'adminMailReply',
                isEncrypted         : true,
                inSession           : true,
                func                : adminMailReply.adminMailReplyApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'adminMailRead',
                isEncrypted         : true,
                inSession           : true,
                func                : adminMailRead.adminMailAsReadApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'adminMailDelete',
                isEncrypted         : true,
                inSession           : true,
                func                : adminMailDelete.adminMailDeleteApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'sessionReport',
                isEncrypted         : true,
                inSession           : true,
                func                : sessionReport.sessionsReportApi,
                viewPerm            : 'AdministrativeTools.SessionsReport',
                contentType         : 'application/json'
            },
            {
                api                 : 'downTimeReport',
                isEncrypted         : true,
                inSession           : true,
                func                : downTimeReport.downTimeReportApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'userActivityReport',
                isEncrypted         : true,
                inSession           : true,
                func                : userActivityReport.userActivityApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'clientActivityReport',
                isEncrypted         : true,
                inSession           : true,
                func                : clientActivityReport.clientActivityApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'reconciliationUsersReport',
                isEncrypted         : true,
                inSession           : true,
                func                : reconciliationUsersReport.reconciliationUsersReportApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'inValidLogin',
                isEncrypted         : true,
                inSession           : true,
                func                : inValidLogin.inValidLoginApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listAccessTypes',
                isEncrypted         : true,
                inSession           : true,
                viewPerm            : '',
                func                : listAccessTypes.accessTypeListApi
            },
            {
                api                 : 'addAccessTypes',
                isEncrypted         : true,
                inSession           : true,
                func                : addAccessTypes.addAccessTypeApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'editAccessType',
                isEncrypted         : true,
                inSession           : true,
                func                : editAccessType.editAccessTypeApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'searchCustomer',
                isEncrypted         : true,
                inSession           : true,
                viewPerm            : 'CustomerSupport.CustomerLoginMaintenance',
                func                : searchCustomer.searchUserApi,
                contentType         : 'application/json'
            },
            {
                api                 : 'exclusionSearchCustomer',
                isEncrypted         : true,
                inSession           : true,
                func                : exclusionSearchCustomer.exclusionSearchUserApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'accExclusionForCustomer',
                isEncrypted         : true,
                inSession           : true,
                func                : accExclusionForCustomer.accExclusionForCustomerApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'directEnroll',
                isEncrypted         : true,
                func                : directEnroll.enrollUserApi,
                contentType         : 'application/json'
            },
            {
                api                 : 'enrollUser',
                isEncrypted         : true,
                func                : enrollUser.enrollUserApi,
                contentType         : 'application/json'
            },
            {
                api                 : 'login',
                isEncrypted         : true,
                func                : login.loginApi,
                contentType         : 'application/json'
            },
            {
                api                 : 'createBankAdmin',
                isEncrypted         : true,
                inSession           : true,
                func                : createBankAdmin.createAdminApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'editBankAdmin',
                isEncrypted         : true,
                inSession           : true,
                func                : editBankAdmin.editAdminApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'changeStatusBankAdmin',
                isEncrypted         : true,
                inSession           : true,
                func                : changeStatusBankAdmin.changeStatusBankAdminApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'adminFirstLogin',
                isEncrypted         : true,
                inSession           : true,
                func                : adminFirstLogin.adminFirstLoginApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'resetSecurityQuestAdmin',
                isEncrypted         : true,
                inSession           : true,
                func                : resetSecurityQuestAdmin.resetSecurityQuestAdminApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'MFAadminSQ',
                isEncrypted         : true,
                inSession           : true,
                func                : MFAadminSQ.mfaAdminSQApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'verifyMFAadminSQ',
                isEncrypted         : true,
                inSession           : true,
                func                : verifyMFAadminSQ.verifyMFAadminSQApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listAdminSecurityQ',
                isEncrypted         : true,
                inSession           : true,
                func                : listAdminSecurityQ.listAdminSecurityQApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listAdminAllSQ',
                isEncrypted         : true,
                inSession           : true,
                func                : listAdminAllSQ.listAdminAllSQApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'addAdminNewQuestionsAtLogin',
                isEncrypted         : true,
                inSession           : true,
                func                : addAdminNewQuestionsAtLogin.addAdminNewQuestionsAtLoginApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'changeAdminSQ',
                isEncrypted         : true,
                inSession           : true,
                func                : changeAdminSQ.changeAdminSQApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'resetPasswordBankAdmin',
                isEncrypted         : true,
                inSession           : true,
                func                : resetPasswordBankAdmin.resetPasswordAdminApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listBankAdmin',
                isEncrypted         : true,
                inSession           : true,
                func                : listBankAdmin.listAdminApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'bankAdminChangePassword',
                isEncrypted         : true,
                inSession           : true,
                func                : bankAdminChangePassword.changeAdminPasswordApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'bankAdminAvailability',
                isEncrypted         : true,
                inSession           : true,
                func                : bankAdminAvailability.adminAvailabilityApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'addBankPasswordRule',
                isEncrypted         : true,
                inSession           : true,
                func                : addBankPasswordRule.bankPasswordRuleApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'getBankPasswordRule',
                isEncrypted         : true,
                inSession           : true,
                viewPerm            : '',
                func                : getBankPasswordRule.showPasswordRuleApi
            },
            {
                api                 : 'changeBankPasswordRule',
                isEncrypted         : true,
                inSession           : true,
                func                : changeBankPasswordRule.changeBankPasswordRuleApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'addBankPolicy',
                isEncrypted         : true,
                inSession           : true,
                func                : addBankPolicy.bankPolicyApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'changeBankPolicy',
                isEncrypted         : true,
                inSession           : true,
                func                : changeBankPolicy.changeBankPolicyApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'getBankPolicy',
                isEncrypted         : true,
                inSession           : true,
                viewPerm            : '',
                func                : getBankPolicy.showBankPolicyApi
            },
            {
                api                 : 'bankAdminLogin',
                isEncrypted         : true,
                func                : bankAdminLogin.loginApi,
                contentType         : 'application/json'
            },
            {
                api                 : 'bankAdminLogout',
                func                : bankAdminLogout.logoutApi,
                contentType         : 'application/json'
            },
            {
                api                 : 'listLockedUser',
                isEncrypted         : true,
                inSession           : true,
                func                : listLockedUser.listLockedUserApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'checkAvailability',
                isEncrypted         : true,
                inSession           : true,
                func                : checkAvailability.checkAvailabilityApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'inActiveUser',
                isEncrypted         : true,
                inSession           : true,
                func                : inActiveUser.inActiveUserApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'activeUser',
                isEncrypted         : true,
                inSession           : true,
                func                : activeUser.activeUsersApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'unLockUser',
                isEncrypted         : true,
                inSession           : true,
                func                : unLockUser.unLockedUserApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'findUser',
                isEncrypted         : true,
                inSession           : true,
                func                : findUser.findUserApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'deleteUserByAdmin',
                isEncrypted         : true,
                inSession           : true,
                func                : deleteUser.deleteUserApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listUserSQ',
                isEncrypted         : true,
                func                : listUserSQ.userSQApi,
                contentType         : 'application/json'
            },
            {
                api                 : 'verifyUserSQ',
                isEncrypted         : true,
                func                : verifyUserSQ.verifyUserSQApi,
                contentType         : 'application/json'
            },
            {
                api                 : 'verifyEmailId',
                isEncrypted         : true,
                func                : verifyEmailId.verifyEmailIdApi,
                contentType         : 'application/json'
            },
            {
                api                 : 'getMailWording',
                isEncrypted         : true,
                inSession           : true,
                func                : getMailWording.getWordingApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'addMailWording',
                isEncrypted         : true,
                inSession           : true,
                func                : addMailWording.addWordingApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'editMailWording',
                isEncrypted         : true,
                inSession           : true,
                func                : editMailWording.editWordingApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'printUserIdTemplate',
                isEncrypted         : true,
                inSession           : true,
                func                : printUserIdTemplate.printUserIdApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'printPasswordTemplate',
                inSession           : true,
                isEncrypted         : true,
                func                : printPasswordTemplate.printPasswordApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'firstTimeLogin',
                inSession           : true,
                isEncrypted         : true,
                func                : firstTimeLogin.firstTimeLoginApi,
                otpService          : 'firstLogin',
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'addNewQuestionsAtLogin',
                isEncrypted         : true,
                inSession           : true,
                func                : addNewQuestionsAtLogin.addNewQuestionsAtLoginApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'MFAUserSQ',
                isEncrypted         : true,
                inSession           : true,
                func                : MFAUserSQ.mfaUserSQApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'verifyMFASQ',
                isEncrypted         : true,
                inSession           : true,
                func                : verifyMFASQ.verifyMFASQApi,
                viewPerm            : '',
                otpService          : 'multiFactorAuthentication',
                contentType         : 'application/json'
            },
            {
                api                 : 'addBYSupervisor',
                isEncrypted         : true,
                inSession           : true,
                func                : addBYSupervisor.enrollUserApi,
                viewPerm            : 'AdministrativeToolsUserManagement.CreateNewUsers',
                contentType         : 'application/json'
            },
            {
                api                 : 'updateBYSupervisor',
                isEncrypted         : true,
                inSession           : true,
                func                : updateBYSupervisor.updateUserApi,
                viewPerm            : 'AdministrativeToolsUserManagement.Users',
                contentType         : 'application/json'
            },
            {
                api                 : 'listSCreatedUser',
                isEncrypted         : true,
                inSession           : true,
                func                : listSCreatedUser.listUserApi,
                viewPerm            : 'AdministrativeToolsUserManagement.Users',
                contentType         : 'application/json'
            },
            {
                api                 : 'changeUTL',
                isEncrypted         : true,
                inSession           : true,
                func                : changeUTL.changeUTLApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'changeUAA',
                isEncrypted         : true,
                inSession           : true,
                func                : changeUAA.changeUAApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'changeSUP',
                isEncrypted         : true,
                inSession           : true,
                func                : changeSUP.changeSUPApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'changeUVA',
                isEncrypted         : true,
                inSession           : true,
                func                : changeUVA.changeUVAApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'changeUSQ',
                isEncrypted         : true,
                inSession           : true,
                func                : changeUSQ.changeUSQApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'unLockBySupervisor',
                isEncrypted         : true,
                inSession           : true,
                func                : unLockUser.unLockedUserApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'deleteUser',
                isEncrypted         : true,
                inSession           : true,
                func                : deleteUser.deleteUserApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listSecurityQ',
                isEncrypted         : true,
                inSession           : true,
                func                : listSecurityQuestion.listSecurityQApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listUserAllSQ',
                isEncrypted         : true,
                inSession           : true,
                func                : listUserAllSQ.userAllSQApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'changeSQ',
                isEncrypted         : true,
                inSession           : true,
                func                : changeSQ.changeSQApi,
                viewPerm            : '',
                otpService          : 'changeSecurityQuestion',
                contentType         : 'application/json'
            },
            {
                api                 : 'changeUP',
                isEncrypted         : true,
                inSession           : true,
                func                : changeUP.changeUPApi,
                viewPerm            : '',
                otpService          : 'changePassword',
                contentType         : 'application/json'
            },
            {
                isEncrypted         : true,
                api                 : 'changePI',
                inSession           : true,
                func                : changePI.changePIApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                isEncrypted         : true,
                api                 : 'addPayment',
                inSession           : true,
                func                : addPayment.addStopPaymentApi,
                viewPerm            : '',
                otpService          : 'stopPayment',
                contentType         : 'application/json'
            },
            {
                api                 : 'editAlert',
                isEncrypted         : true,
                inSession           : true,
                func                : editAlert.editAlertApi,
                viewPerm            : 'ProfileManagement.Alerts',
                contentType         : 'application/json'
            },
            {
                api                 : 'listPayment',
                isEncrypted         : true,
                inSession           : true,
                func                : listPayment.listStopPaymentApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'deletePayment',
                isEncrypted         : true,
                inSession           : true,
                func                : deletePayment.deleteStopPaymentApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'addAlert',
                isEncrypted         : true,
                inSession           : true,
                func                : addAlert.addAlertApi,
                viewPerm            : 'ProfileManagement.Alerts',
                contentType         : 'application/json'
            },
            {
                api                 : 'listAlert',
                isEncrypted         : true,
                inSession           : true,
                func                : listAlert.listAlertApi,
                viewPerm            : 'ProfileManagement.Alerts',
                contentType         : 'application/json'
            },
            {
                api                 : 'enrollmentsList',
                isEncrypted         : true,
                inSession           : true,
                func                : enrollmentsList.enrollmentListApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'deleteAlert',
                isEncrypted         : true,
                inSession           : true,
                func                : deleteAlert.deleteAlertApi,
                viewPerm            : 'ProfileManagement.Alerts',
                contentType         : 'application/json'
            },
            {
                api                 : 'deEnrollAccountNumbers',
                inSession           : true,
                isEncrypted         : true,
                func                : deEnrollAccountNumbers.deEnrollAccountNumbersApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'addReminder',
                isEncrypted         : true,
                inSession           : true,
                func                : addReminder.addReminderApi,
                viewPerm            : 'ProfileManagement.Reminders',
                contentType         : 'application/json'
            },
            {
                api                 : 'editReminder',
                isEncrypted         : true,
                inSession           : true,
                func                : editReminder.editReminderApi,
                viewPerm            : 'ProfileManagement.Reminders',
                contentType         : 'application/json'
            },
            {
                api                 : 'deleteReminder',
                isEncrypted         : true,
                inSession           : true,
                func                : deleteReminder.deleteReminderApi,
                viewPerm            : 'ProfileManagement.Reminders',
                contentType         : 'application/json'
            },
            {
                api                 : 'showReminder',
                isEncrypted         : true,
                inSession           : true,
                func                : showReminder.showReminderApi,
                viewPerm            : 'ProfileManagement.Reminders',
                contentType         : 'application/json'
            },
            {
                api                 : 'listReminder',
                isEncrypted         : true,
                inSession           : true,
                func                : listReminder.listReminderApi,
                viewPerm            : 'ProfileManagement.Reminders',
                contentType         : 'application/json'
            },
            {
                api                 : 'logout',
                inSession           : true,
                func                : logout.logoutApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'payveris',
                isEncrypted         : true,
                inSession           : true,
                func                : payveris.payverisSessionApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'mx',
                isEncrypted         : true,
                inSession           : true,
                func                : mx.mxSessionApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'customerInquiry',
                isEncrypted         : true,
                inSession           : true,
                func                : customerInquiry.customerInquiryApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'adminCustomerInquiry',
                isEncrypted         : true,
                inSession           : true,
                func                : adminCustomerInquiry.adminCustomerInquiryApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'bondCalculator',
                isEncrypted         : true,
                inSession           : true,
                func                : bondCalculator.bondCalculatorApi,
                viewPerm            : 'Calculators.Bond',
                contentType         : 'application/json'
            },
            {
                api                 : 'checkImages',
                isEncrypted         : true,
                inSession           : true,
                func                : checkImages.checkImageApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'customerAccounts',
                isEncrypted         : true,
                inSession           : true,
                func                : customerAccounts.customerAccountApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'accountInquiry',
                isEncrypted         : true,
                inSession           : true,
                func                : accountInquiry.accountInquiryApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'statementDownload',
                isEncrypted         : true,
                inSession           : true,
                func                : statementDownload.statementDownloadApi,
                viewPerm            : 'Accounts.Statements',
                otpService          : 'statements',
                contentType         : 'application/json'
            },
            {
                api                 : 'statementFile',
                isEncrypted         : true,
                inSession           : true,
                func                : statementFile.statementFileApi,
                viewPerm            : 'Accounts.Statements',
                contentType         : 'application/json'
            },
            {
                api                 : 'getStatementFile',
                isEncrypted         : true,
                inSession           : true,
                func                : getStatementFile.getStatementFileApi,
                viewPerm            : 'Accounts.Statements',
                contentType         : 'application/json'
            },
            {
                api                 : 'transactionInquiry',
                isEncrypted         : true,
                inSession           : true,
                func                : transactionInquiry.transactionInquiryApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'fundsTransfer',
                isEncrypted         : true,
                inSession           : true,
                func                : fundsTransfer.fundsTransferApi,
                otpService          : 'fundsTransfer',
                viewPerm            : 'Payments.FundsTransfer || BusinessServices.BusinessFundsTransfer',
                contentType         : 'application/json'
            },
            {
                api                 : 'fundsTransferLogs',
                isEncrypted         : true,
                inSession           : true,
                func                : fundsTransferLogs.fundsTransferLogsApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'editFundsTransfer',
                isEncrypted         : true,
                inSession           : true,
                func                : editFundsTransfer.editFundsTransferApi,
                viewPerm            : 'Payments.FundsTransfer || BusinessServices.BusinessFundsTransfer',
                contentType         : 'application/json'
            },
            {
                api                 : 'deleteFundsTransfer',
                isEncrypted         : true,
                inSession           : true,
                func                : deleteFundsTransfer.deleteFundsTransferApi,
                viewPerm            : 'Payments.FundsTransfer || BusinessServices.BusinessFundsTransfer',
                contentType         : 'application/json'
            },
            {
                api                 : 'pendingTransfer',
                isEncrypted         : true,
                inSession           : true,
                func                : pendingTransfer.pendingTransferApi,
                viewPerm            : 'Payments.FundsTransfer || BusinessServices.BusinessFundsTransfer',
                contentType         : 'application/json'
            },
            {
                api                 : 'addBeneficiary',
                isEncrypted         : true,
                inSession           : true,
                func                : addBeneficiary.addBeneficiaryApi,
                viewPerm            : '',
                otpService          : 'wireTransferNewBeneficiary',
                contentType         : 'application/json'
            },
            {
                api                 : 'addThirdPartyBeneficiary',
                isEncrypted         : true,
                inSession           : true,
                func                : addThirdPartyBeneficiary.addThirdPartyBeneficiaryApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listBeneficiary',
                isEncrypted         : true,
                inSession           : true,
                func                : listBeneficiary.listBeneficiaryApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'editBeneficiary',
                isEncrypted         : true,
                inSession           : true,
                func                : editBeneficiary.editBeneficiaryApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'deleteBeneficiary',
                isEncrypted         : true,
                inSession           : true,
                func                : deleteBeneficiary.deleteBeneficiaryApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'listThirdPartyBeneficiary',
                isEncrypted         : true,
                inSession           : true,
                func                : listThirdPartyBeneficiary.listThirdPartyBeneficiaryApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'editThirdPartyBeneficiary',
                isEncrypted         : true,
                inSession           : true,
                func                : editThirdPartyBeneficiary.editThirdPartyBeneficiaryApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'deleteThirdPartyBeneficiary',
                isEncrypted         : true,
                inSession           : true,
                func                : deleteThirdPartyBeneficiary.deleteThirdPartyBeneficiaryApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'deletePendingThirdPartyBeneficiary',
                isEncrypted         : true,
                inSession           : true,
                func                : deletePendingThirdPartyBeneficiary.deletePendingThirdPartyBeneficiaryApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'customerSearch',
                isEncrypted         : true,
                inSession           : true,
                viewPerm            : '',
                func                : customerSearch.customerSearchApi
            },
            {
                api                 : 'enrollAndPrint',
                isEncrypted         : true,
                inSession           : true,
                viewPerm            : '',
                func                : enrollAndPrint.enrollAndPrintApi
            },
            {
                api                 : 'enrollAndMail',
                isEncrypted         : true,
                inSession           : true,
                viewPerm            : '',
                func                : enrollAndMail.enrollAndMailApi
            },
            {
                api                 : 'desiredEnroll',
                isEncrypted         : true,
                inSession           : true,
                viewPerm            : '',
                func                : desiredEnroll.desiredEnrollApi
            },
            {
                api                 : 'reactivateUser',
                isEncrypted         : true,
                inSession           : true,
                viewPerm            : '',
                func                : reactivateUser.reactivateUserApi
            },
            {
                api                 : 'eodExtractDownload',
                inSession           : true,
                viewPerm            : '',
                func                : eodExtractDownload.eodExtractDownloadApi
            },
            {
                api                 : 'getContactDetailsForUser',
                isEncrypted         : true,
                inSession           : true,
                viewPerm            : '',
                func                : getContactDetailsForUser.getContactDetailsForUserApi
            },
            {
                api                 : 'addWireTransfer',
                inSession           : true,
                isEncrypted         : true,
                func                : addWireTransfer.addWireTransferApi,
                viewPerm            : '',
                otpService          : 'wireTransferNewRequest',
                contentType         : 'application/json'
            },
            {
                api                 : 'listWireTransfer',
                isEncrypted         : true,
                inSession           : true,
                func                : listWireTransfer.listWireTransferApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'authorizeWireTransfer',
                inSession           : true,
                isEncrypted         : true,
                func                : authorizeWireTransfer.authorizeWireTransferApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'deleteWireTransfer',
                inSession           : true,
                func                : deleteWireTransfer.deleteWireTransferApi,
                isEncrypted         : true,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'createBatch',
                inSession           : true,
                func                : createBatch.createBatchApi,
                viewPerm            : 'BusinessServicesACH.CreateNewBatch',
                isEncrypted         : true,
                otpService          : 'achNewBatch',
                contentType         : 'application/json'
            },
            {
                api                 : 'processACHBatch',
                inSession           : true,
                func                : processACHBatch.processACHBatchApi,
                isEncrypted         : true,
                contentType         : 'application/json'
            },
            {
                api                 : 'reinitiateACHBatch',
                inSession           : true,
                func                : reinitiateACHBatch.reinitiateACHBatchApi,
                isEncrypted         : true,
                contentType         : 'application/json'
            },
            {
                api                 : 'updateBatch',
                inSession           : true,
                isEncrypted         : true,
                func                : updateBatch.batchUpdateApi,
                viewPerm            : 'BusinessServicesACH.CreateNewBatch',
                contentType         : 'application/json'
            },
            {
                api                 : 'removeBatch',
                isEncrypted         : true,
                inSession           : true,
                func                : removeBatch.batchRemoveApi,
                viewPerm            : 'BusinessServicesACH.CreateNewBatch',
                contentType         : 'application/json'
            },
            {
                api                 : 'createBatchRecipient',
                inSession           : true,
                isEncrypted         : true,
                func                : createBatchRecipient.createRecipientApi,
                viewPerm            : 'BusinessServicesACH.ACHRecipients',
                contentType         : 'application/json'
            },
            {
                isEncrypted         : true,
                api                 : 'updateRecipient',
                inSession           : true,
                func                : updateRecipient.recipientUpdateApi,
                viewPerm            : 'BusinessServicesACH.ACHRecipients',
                contentType         : 'application/json'
            },
            {
                api                 : 'removeRecipient',
                isEncrypted         : true,
                inSession           : true,
                func                : removeRecipient.recipientRemoveApi,
                viewPerm            : 'BusinessServicesACH.ACHRecipients',
                contentType         : 'application/json'
            },
            {
                api                 : 'excludeRecipient',
                inSession           : true,
                isEncrypted         : true,
                func                : excludeRecipient.recipientExcludeApi,
                viewPerm            : 'BusinessServicesACH.ACHRecipients',
                contentType         : 'application/json'
            },
            {
                api                 : 'includeRecipient',
                inSession           : true,
                func                : includeRecipient.recipientIncludeApi,
                isEncrypted         : true,
                viewPerm            : 'BusinessServicesACH.ACHRecipients',
                contentType         : 'application/json'
            },
            {
                api                 : 'authorizeBatch',
                isEncrypted         : true,
                inSession           : true,
                func                : authorizeBatch.batchAuthorizeApi,
                viewPerm            : 'BusinessServicesACH.ACHBatchAuthorization',
                otpService          : 'achBatchAuthorization',
                contentType         : 'application/json'
            },
            {
                api                 : 'deAuthorizeBatch',
                isEncrypted         : true,
                inSession           : true,
                func                : deAuthorizeBatch.batchDeAuthorizeApi,
                viewPerm            : 'BusinessServicesACH.ACHBatchAuthorization',
                contentType         : 'application/json'
            },
            {
                api                 : 'allBatch',
                inSession           : true,
                isEncrypted         : true,
                func                : allBatch.listAllBatchApi,
                viewPerm            : 'BusinessServicesACH.ACHBatchSummary',
                contentType         : 'application/json'
            },
            {
                api                 : 'pendingBatch',
                inSession           : true,
                isEncrypted         : true,
                func                : pendingBatch.listPendingBatchApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'editableBatch',
                inSession           : true,
                isEncrypted         : true,
                func                : editableBatch.listEditableBatchApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                isEncrypted         : true,
                api                 : 'batchRecipient',
                inSession           : true,
                func                : batchRecipient.listRecipientApi,
                viewPerm            : 'BusinessServicesACH.ACHRecipients',
                contentType         : 'application/json'
            },
            {
                api                 : 'batchDetail',
                isEncrypted         : true,
                inSession           : true,
                func                : batchDetail.batchDetailApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'uploadAchFile',
                inSession           : true,
                func                : uploadAchFile.uploadAchApi,
                viewPerm            : 'BusinessServicesACH.ACHFileImport',
                contentType         : 'multipart/form-data'
            },
            {
                isEncrypted         : true,
                api                 : 'listAchFile',
                inSession           : true,
                func                : listAchFile.listUploadAchApi,
                viewPerm            : 'BusinessServicesACH.ACHFileImportAuthorization',
                contentType         : 'application/json'
            },
            {
                api                 : 'listAchFileBatch',
                isEncrypted         : true,
                inSession           : true,
                func                : listAchFileBatch.listFileBatchApi,
                viewPerm            : 'BusinessServicesACH.ACHFileImportAuthorization',
                contentType         : 'application/json'
            },
            {
                api                 : 'batchProcessAch',
                inSession           : true,
                isEncrypted         : true,
                func                : batchProcessAch.batchProcessAchApi,
                viewPerm            : 'BusinessServicesACH.ACHFileImportAuthorization',
                contentType         : 'application/json'
            },
            {
                api                 : 'batchRemoveAch',
                inSession           : true,
                func                : batchRemoveAch.batchRemoveAchApi,
                isEncrypted         : true,
                viewPerm            : 'BusinessServicesACH.ACHFileImportAuthorization',
                contentType         : 'application/json'
            },
            {
                api                 : 'routingNumber',
                isEncrypted         : true,
                inSession           : true,
                func                : routingNumber.findRoutingNumberApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'orderCheck',
                inSession           : true,
                isEncrypted         : true,
                func                : orderCheck.requestCheckApi,
                viewPerm            : 'OtherServices.OrderChecks',
                otpService          : 'orderChecks',
                contentType         : 'application/json'
            },
            {
                api                 : 'statementsEnrollment',
                inSession           : true,
                isEncrypted         : true,
                func                : statementsEnrollment.requestStatementEnrollment,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'sendEmailFromUser',
                inSession           : true,
                func                : sendEmailFromUser.mailToAdminApi,
                isEncrypted         : true,
                viewPerm            : 'AdministrativeTools.BankMail',
                contentType         : 'application/json'
            },
            {
                api                 : 'listUserInbox',
                isEncrypted         : true,
                inSession           : true,
                func                : listUserInbox.userMailInboxApi,
                viewPerm            : 'AdministrativeTools.BankMail',
                contentType         : 'application/json'
            },
            {
                api                 : 'listUserTrashBox',
                inSession           : true,
                isEncrypted         : true,
                func                : listUserTrashBox.userMailTrashApi,
                viewPerm            : 'AdministrativeTools.BankMail',
                contentType         : 'application/json'
            },
            {
                api                 : 'listUserSentBox',
                inSession           : true,
                func                : listUserSentBox.userMailSentApi,
                isEncrypted         : true,
                viewPerm            : 'AdministrativeTools.BankMail',
                contentType         : 'application/json'
            },
            {
                api                 : 'userMailToTrashBox',
                isEncrypted         : true,
                inSession           : true,
                func                : userMailToTrashBox.userMailToTrashApi,
                viewPerm            : 'AdministrativeTools.BankMail',
                contentType         : 'application/json'
            },
            {
                api                 : 'userMailReply',
                inSession           : true,
                isEncrypted         : true,
                func                : userMailReply.userMailReplyApi,
                viewPerm            : 'AdministrativeTools.BankMail',
                contentType         : 'application/json'
            },
            {
                api                 : 'userMailRead',
                inSession           : true,
                func                : userMailRead.userMailAsReadApi,
                isEncrypted         : true,
                viewPerm            : 'AdministrativeTools.BankMail',
                contentType         : 'application/json'
            },
            {
                api                 : 'userMailDelete',
                inSession           : true,
                func                : userMailDelete.userMailDeleteApi,
                viewPerm            : 'AdministrativeTools.BankMail',
                isEncrypted         : true,
                contentType         : 'application/json'
            },
            {
                api                 : 'updateNickName',
                inSession           : true,
                func                : updateNickName.updateNickNameApi,
                isEncrypted         : true,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'updateOtpConfig',
                func                : updateOtpConfig.updateOtpConfigApi,
                isEncrypted         : true,
                inSession           : true,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'showOtpConfig',
                func                : showOtpConfig.showOtpConfigApi,
                isEncrypted         : true,
                viewPerm            : '',
                inSession           : true,
                contentType         : 'application/json'
            },
            {
                isEncrypted         : true,
                api                 : 'validateOtp',
                inSession           : true,
                func                : validateOtp.validateOtpApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'forgotPasswordOtp',
                isEncrypted         : true,
                func                : forgotPasswordOtp.forgotPasswordOtpApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'otpHandler',
                func                : otpHandler.otpHandlerApi,
                isEncrypted         : true,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'limitProfileNew',
                isEncrypted         : true,
                inSession           : true,
                func                : limitProfileNew.limitProfileNewApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'limitProfileEdit',
                inSession           : true,
                isEncrypted         : true,
                func                : limitProfileEdit.limitProfileEditApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                isEncrypted         : true,
                api                 : 'limitProfileDelete',
                inSession           : true,
                func                : limitProfileDelete.limitProfileDeleteApi,
                viewPerm            : '',
                contentType         : 'application/json'
            },
            {
                api                 : 'limitProfilesList',
                inSession           : true,
                viewPerm            : '',
                isEncrypted         : true,
                func                : limitProfilesList.limitProfilesListApi
            },
            {
                api                 : 'limitProfileUsersList',
                inSession           : true,
                isEncrypted         : true,
                viewPerm            : '',
                func                : limitProfileUsersList.limitProfileUsersListApi
            },
            {
                api                 : 'overrideLimitProfileForUser',
                isEncrypted         : true,
                inSession           : true,
                viewPerm            : '',
                func                : overrideLimitProfileForUser.overrideLimitProfileForUserApi
            },
            {
                api                 : 'depositCheck',
                isEncrypted         : true,
                 inSession           : true,
                func                : depositCheck.api,
                //viewPerm            : 'CheckDeposit.Deposit'
            },
            {
                api                 : 'deleteDeposit',
                isEncrypted         : true,
                 inSession           : true,
                func                : deleteDeposit.api,
                viewPerm            : 'CheckDeposit.Deposit'
            },
            {
                api                 : 'deleteCheck',
                isEncrypted         : true,
                // inSession           : true,
                func                : deleteCheck.api,
                //viewPerm            : 'CheckDeposit.Deposit'
            },
            {
                api                 : 'depositTransmit',
                isEncrypted         : true,
                // inSession           : true,
                func                : depositTransmit.api,
                //viewPerm            : 'CheckDeposit.Deposit'
            },
            {
                api                 : 'checkDepositHistroy',
                //isEncrypted         : true,
                inSession           : true,
                func                : checkDepositHistroy.api,
                //viewPerm            : 'CheckDeposit.DepositHistory'
            },
            {
                api                 : 'userLimits',
                inSession           : true,
                viewPerm            : '',
                isEncrypted         : true,
                func                : userLimits.userLimitsApi
            }
        ];

        return function(callback){
            var router = new RouteApi(rin , routes);
            var resHandle = router.sessionController.bind(router);
            resHandle(callback);
        };
    }

    var RouteApi = function(rin , routes){
        this.rin = rin;
        this.rin.config.populate();
        this.rin.config = this.rin.config.getConfig();
        this.rin.config.userCurrentIp = this.rin.header['x-forwarded-for'] || this.ip;
        this.rin.config.instId = this.rin.header['x-inst-id'] || '1';
        this.rin.config.setLang = this.rin.header['x-lang'] || 'EN';
        this.tnxId = rin.header['x-request-id'] || '';
        this.routes = routes;
        this.apiObj = _.findWhere(routes , {api : this.rin.callApi});
    };

    RouteApi.prototype = {
        sessionReturn : function(error , success){
            if(error){
                this.callback(null , error);
            }else{
                var viewPerm = this.apiObj.viewPerm;
                var accessObj = this.rin.session.viewAccess;
                var viewAccess = accessHandler(viewPerm, accessObj, this.rin.config);
                var resHandle = this.checkUserAccess.bind(this);
                viewAccess.checkViewAccess(resHandle);
                //this.apiObj.func(this.rin, this.callback);
            }
        },
        sessionController: function(callback){
            this.callback = callback;

            if(this.apiObj.isEncrypted) {
                var that = this;
                var token = this.rin.request.body.data;
                var isMobileApp = this.rin.request.body.data2;
                var key, shaObj, hash, decoded, download;

                if(isMobileApp == 'bf0ba73833f0998a22430c7d000785ddb7549c13ac9acf0c09d3166a3425b9ed'){
                    decoded = jwt.decode(token)
                    download = this.rin.request.body.download;
                    this.rin.request.body = decoded
                    this.rin.request.body.download = (download) ? download : this.rin.request.body.download;
                }else {
                    var headers = null || [];
                    var header = this.rin.request.headers.cookie.split(';');
                    for (var i = 0; i < header.length; i++) {
                        headers[header[i].split("=")[0].trim()] = unescape(header[i].split("=")[1]).trim();
                    }
                    key = headers['IRIS-Digital-Banking.sig']
                    shaObj = new jsSHA("SHA-256", "TEXT");
                    shaObj.update(key);
                    hash = shaObj.getHash("HEX");
                    if (hash == this.rin.request.body.data2) {
                        try {
                            decoded = jwt.verify(token, key, {algorithms: ["HS256"]})
                            download = this.rin.request.body.download;
                            this.rin.request.body = decoded
                            this.rin.request.body.download = (download) ? download : this.rin.request.body.download;
                        } catch (err) {
                            this.rin.body = {status: 401, responseData: {message: 'Unauthorized Access'}};
                            this.rin.status = 401;
                            return this.callback(null, this.rin);
                        }
                    } else {
                        this.rin.body = {status: 401, responseData: {message: 'Unauthorized Access'}};
                        this.rin.status = 401;
                        return this.callback(null, this.rin);
                    }
                }
            }
            if(globalConn.isDown('Channel') && this.rin.method == "POST"){
                this.rin.body = {status: 400 ,responseData: {message: 'Database Service Not available'}};
                this.rin.status = 400;
                return this.callback(null , this.rin);
            }

            ///multipart/form-data; boundary=----WebKitFormBoundaryT9j7yrBlYg9mN0Em multipartHeader =

            var multiHead = (this.rin.header['content-type']) || '';
            var multipartHeader = multiHead.split(';');
            if(!this.apiObj.contentType || this.apiObj.contentType == this.rin.header['content-type'] || this.apiObj.contentType == multipartHeader[0]){

                if(this.apiObj.inSession) {
                    var resHandle = this.sessionReturn.bind(this);
                    var sessionManagement = handleSession.handleSession(this.rin, resHandle);
                    var sessionHandle = sessionManagement.sessionCaller.bind(sessionManagement);
                    sessionHandle();
                }else{
                    this.apiObj.func(this.rin , this.callback);
                }

            }else{
                this.rin.body = {status: 415 ,responseData: {message: 'Unsupported Media Type'}};
                this.rin.status = 415;
                return this.callback(null , this.rin);
            }
        },
        checkUserAccess: function(error , isAccess){
            if(error){
                this.rin.body = error;
                this.rin.status = error.status;
                this.callback(null , this.rin);
            }else{
                //check if otp is required
                var otpService = this.apiObj.otpService;
                if(otpService && otpService != ''){
                    var otpConfig = otpConfigHandler(this.rin.config , this.tnxId);
                    var resHandle = this.handleOtpService.bind(this);
                    otpConfig.isOtpConfigAvailable(otpService , resHandle);
                }else{
                    this.apiObj.func(this.rin, this.callback);
                }
            }
        },
        handleOtpService: function(isOtpRequired , otpData){
            if(isOtpRequired){
                this.rin.request.body.otpData = otpData;
                this.rin.request.body.otpData['emailId'] = this.rin.session.userInfo.emailId;
                //this.rin.request.body.otpData['phoneNo'] = this.rin.session.userInfo.phoneNo;
                this.rin.request.body.otpData['customersId'] = this.rin.session.customersId;
                this.rin.request.body.otpData['customerName'] = this.rin.session.customerName;
                this.rin.request.body.otpData['createdBy'] = this.rin.session.createdBy;
                this.rin.request.body.otpService = this.apiObj.otpService;
                this.rin.request.body.sessionId = this.rin.sessionId;
                var otpApi = _.findWhere(this.routes , {api : 'otpHandler'});
                otpApi.func(this.rin, this.callback);
            }else{
                this.apiObj.func(this.rin, this.callback);
            }
        }
    };

    module.exports.route = function(app , rin){

        return (new Route(app , rin));
    };
})();
/*
 {
 "FiSecurityOptions": {
 "ChangePassword": true,
 "BankPassword": true,
 "UserSecurity": true,
 "GroupMail": false
 },
 "CustomerSupport": {
 "CustomerOnboarding": {
 "BranchOnboarding": true
 },
 "CustomerLoginMaintenance": true,
 "AccountExclusion": true,
 "BankMail": true,
 "MailWording": true,
 "DeleteCustomer": false,
 "UserActivityReport": true,
 "FindUserDetail": true
 },
 "FiPolicies": {
 "AccessType": true,
 "CustomerUserIdPassword": true,
 "OtpConfiguration": true,
 "LimitProfile": true,
 "MultiLingual": true,
 "Site": true
 },
 "FileProcessing": {
 "ExtractDownload": true
 },
 "Reports": {
 "DowntimeReport": true,
 "InactivityReport": true,
 "InvalidLoginAttemptsReport": true,
 "CustomerWisePageHits": false,
 "PageHitsReport": true
 }
 }*/
/*
{
 "UserType": "Business",
 "Accounts": {
 "Overview": true,
 "DetailsHistory": true,
 "Statements": true,
 "StatementsEnrollment": true
 },
 "CheckDeposit": {
 "Deposit": true,
 "DepositHistory": true
 },
 "Payments": {
 "BillPay": false,
 "PendingTransfer": false,
 "FundsTransfer": false,
 "TransferMoneyAtOtherFI": false,
 "PayOtherPeople": false,
 "ThirdPartyTransfer": false
 },
 "PaymentsWireTransfer": {
 "WireTransferAuthorization": false,
 "WireTransferRequest": false,
 "ListBeneficiary": false,
 "RegisterBeneficiary": false
 },
 "PaymentsThirdPartyTransfer": {
 "ListThirdPartyBeneficiary": false,
 "RegisterThirdPartyBeneficiary": false
 },
 "BusinessServicesACH": {
 "ACHFileImportAuthorization": true,
 "ACHFileImport": true,
 "ACHBatchAuthorization": true,
 "ACHRecipients": true,
 "ACHAddNewRecipients": true,
 "CreateNewBatch": true,
 "ACHBatchSummary": true
 },
 "BusinessServicesWireTransfer": {
 "WireTransferAuthorization": true,
 "WireTransferRequest": true,
 "ListBeneficiary": true,
 "RegisterBeneficiary": true
 },
 "BusinessServices": {
 "BusinessFundsTransfer": true,
 "BusinessThirdPartyTransfer": true,
 "PositivePay": false,
 "BillPay": true
 },
 "OtherServices": {
 "OrderChecks": true,
 "StopPayments": true
 },
 "ProfileManagement": {
 "ChangePassword": true,
 "ChangeSecurityQuestion": true,
 "ViewPersonalInfo": true,
 "Reminders": true,
 "Alerts": true
 },
 "AdministrativeTools": {
 "SessionsReport": false,
 "BankMail": true
 },
 "AdministrativeToolsUserManagement": {
 "CreateNewUsers": true,
 "Users": true
 },
 "Calculators": {
 "Bond": true,
 "Retirement": false,
 "Savings": true,
 "Loan": true
 }
 }
 */