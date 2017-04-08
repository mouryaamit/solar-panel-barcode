(function () {
    "use strict";

    var send = require('koa-send');

    var path = require('path');

    var router = require('./route');

    module.exports = function (app) {

        //START PAYVERIS GET CALLS

        /*app.route('/iris/payment/redirect/SignOn/KeepAlive.aspx')
         .get(function * (next) {
         this.callApi = router.apiCalls.keepAlive;
         yield router.route(app , this);
         });*/
        //END PAYVERIS GET CALLS

        //START /IRIS API CALLS

        app.route('/iris/keep/alive')
            .post(function *(next) {
                this.callApi = router.apiCalls.keepAlive;
                yield router.route(app, this);
            });

        app.route('/iris/page/hit')
            .post(function *(next) {
                this.callApi = router.apiCalls.pageHit;
                yield router.route(app, this);
            });

        app.route('/iris/init')
            .get(function *(next) {
                var secretObj = app.keys;
                //this.session.cookie.path = '/'
                yield this.regenerateSession();
                this.session.secret = secretObj;
                this.callApi = router.apiCalls.clientInit;
                yield router.route(app, this);
            });

        app.route('/iris/admin/init')
            .get(function *(next) {
                var secretObj = app.keys;
                //this.session.cookie.path = '/admin/'
                yield this.regenerateSession();
                this.session.secret = secretObj;
                this.callApi = router.apiCalls.adminInit;
                yield router.route(app, this);
            });

        app.route('/iris/login')
            .post(function *(next) {
                var secret = this.session.secret;
                //this.session.cookie.path = '/'
                yield this.regenerateSession();
                this.session.secret = secret;
                this.callApi = router.apiCalls.login;
                yield router.route(app, this);
            });

        app.route('/iris/first/change')
            .post(function *(next) {
                this.callApi = router.apiCalls.firstTimeLogin;
                yield router.route(app, this);
            });

        app.route('/iris/question/change')
            .post(function *(next) {
                this.callApi = router.apiCalls.addNewQuestionsAtLogin;
                yield router.route(app, this);
            });

        app.route('/iris/mfa/question')
            .post(function *(next) {
                this.callApi = router.apiCalls.MFAUserSQ;
                yield router.route(app, this);
            });

        app.route('/iris/verify/mfa')
            .post(function *(next) {
                this.callApi = router.apiCalls.verifyMFASQ;
                yield router.route(app, this);
            });

        app.route('/iris/check/availability')
            .post(function *(next) {
                this.callApi = router.apiCalls.checkAvailability;
                yield router.route(app, this);
            });

        app.route('/iris/admin/first/change')
            .post(function *(next) {
                this.callApi = router.apiCalls.adminFirstLogin;
                yield router.route(app, this);
            });


        app.route('/iris/admin/question/reset')
            .post(function *(next) {
                this.callApi = router.apiCalls.resetSecurityQuestAdmin;
                yield router.route(app, this);
            });

        app.route('/iris/admin/mfa/question')
            .post(function *(next) {
                this.callApi = router.apiCalls.MFAadminSQ;
                yield router.route(app, this);
            });

        app.route('/iris/admin/verify/mfa')
            .post(function *(next) {
                this.callApi = router.apiCalls.verifyMFAadminSQ;
                yield router.route(app, this);
            });

        app.route('/iris/list/security/question')
            .post(function *(next) {
                this.callApi = router.apiCalls.listSecurityQ;
                yield router.route(app, this);
            });

        app.route('/iris/admin/list/security/question')
            .post(function *(next) {
                this.callApi = router.apiCalls.listAdminSecurityQ;
                yield router.route(app, this);
            });

        app.route('/iris/admin/all/security/question')
            .post(function *(next) {
                this.callApi = router.apiCalls.listAdminAllSQ;
                yield router.route(app, this);
            });

        app.route('/iris/admin/question/change')
            .post(function *(next) {
                this.callApi = router.apiCalls.addAdminNewQuestionsAtLogin;
                yield router.route(app, this);
            });

        app.route('/iris/admin/change/security/question')
            .post(function *(next) {
                this.callApi = router.apiCalls.changeAdminSQ;
                yield router.route(app, this);
            });

        app.route('/iris/user/security/question')
            .post(function *(next) {
                this.callApi = router.apiCalls.listUserSQ;
                yield router.route(app, this);
            });

        app.route('/iris/user/all/security/question')
            .post(function *(next) {
                this.callApi = router.apiCalls.listUserAllSQ;
                yield router.route(app, this);
            });

        app.route('/iris/verify/security/question')
            .post(function *(next) {
                this.callApi = router.apiCalls.verifyUserSQ;
                yield router.route(app, this);
            });

        app.route('/iris/verify/emailId')
            .post(function *(next) {
                this.callApi = router.apiCalls.verifyEmailId;
                yield router.route(app, this);
            });
        app.route('/iris/logout')
            .post(function *(next) {
                this.callApi = router.apiCalls.logout;
                yield router.route(app, this);
            });

        app.route('/iris/customer/inquiry')
            .post(function *(next) {
                this.callApi = router.apiCalls.customerInquiry;
                yield router.route(app, this);
            });

        app.route('/iris/admin/customer/inquiry')
            .post(function *(next) {
                this.callApi = router.apiCalls.adminCustomerInquiry;
                yield router.route(app, this);
            });

        app.route('/iris/customer/accounts')
            .post(function *(next) {
                this.callApi = router.apiCalls.customerAccounts;
                yield router.route(app, this);
            });

        app.route('/iris/bond/calculate')
            .post(function *(next) {
                this.callApi = router.apiCalls.bondCalculator;
                yield router.route(app, this);
            });

        app.route('/iris/check/image')
            .post(function *(next) {
                this.callApi = router.apiCalls.checkImages;
                yield router.route(app, this);
            });

        app.route('/iris/account/inquiry')
            .post(function *(next) {
                this.callApi = router.apiCalls.accountInquiry;
                yield router.route(app, this);
            });

        app.route('/iris/transaction/inquiry')
            .post(function *(next) {
                this.callApi = router.apiCalls.transactionInquiry;
                this.request.body.download = 'no';
                yield router.route(app, this);
            });

        app.route('/iris/transaction/inquiry/download')
            .post(function *(next) {
                this.callApi = router.apiCalls.transactionDownload;
                this.gotoRequest = 'transactionInquiry';
                yield router.route(app, this);
            });

        app.route('/iris/funds/transfer')
            .post(function *(next) {
                this.callApi = router.apiCalls.fundsTransfer;
                yield router.route(app, this);
            });

        app.route('/iris/funds/transfer/logs')
            .post(function *(next) {
                this.callApi = router.apiCalls.fundsTransferLogs;
                yield router.route(app, this);
            });

        app.route('/iris/statement/download')
            .post(function *(next) {
                this.callApi = router.apiCalls.statementDownload;
                yield router.route(app, this);
            });

        app.route('/iris/statement/file')
            .post(function *(next) {
                this.callApi = router.apiCalls.getStatementFile;
                yield router.route(app, this);
            });

        app.route('/iris/edit/funds/transfer')
            .post(function *(next) {
                this.callApi = router.apiCalls.editFundsTransfer;
                yield router.route(app, this);
            });

        app.route('/iris/delete/funds/transfer')
            .post(function *(next) {
                this.callApi = router.apiCalls.deleteFundsTransfer;
                yield router.route(app, this);
            });

        app.route('/iris/pending/transfer')
            .post(function *(next) {
                this.callApi = router.apiCalls.pendingTransfer;
                yield router.route(app, this);
            });

        app.route('/iris/payveris/session')
            .post(function *(next) {
                this.callApi = router.apiCalls.payveris;
                yield router.route(app, this);
            });

        app.route('/iris/mx/session')
            .post(function *(next) {
                this.callApi = router.apiCalls.mx;
                yield router.route(app, this);
            });

        app.route('/iris/create/batch')
            .post(function *(next) {
                this.callApi = router.apiCalls.createBatch;
                yield router.route(app, this);
            });

        app.route('/iris/update/batch')
            .post(function *(next) {
                this.callApi = router.apiCalls.updateBatch;
                yield router.route(app, this);
            });

        app.route('/iris/remove/batch')
            .post(function *(next) {
                this.callApi = router.apiCalls.removeBatch;
                yield router.route(app, this);
            });

        app.route('/iris/create/recipient')
            .post(function *(next) {
                this.callApi = router.apiCalls.createBatchRecipient;
                yield router.route(app, this);
            });

        app.route('/iris/update/recipient')
            .post(function *(next) {
                this.callApi = router.apiCalls.updateRecipient;
                yield router.route(app, this);
            });

        app.route('/iris/remove/recipient')
            .post(function *(next) {
                this.callApi = router.apiCalls.removeRecipient;
                yield router.route(app, this);
            });

        app.route('/iris/exclude/recipient')
            .post(function *(next) {
                this.callApi = router.apiCalls.excludeRecipient;
                yield router.route(app, this);
            });

        app.route('/iris/include/recipient')
            .post(function *(next) {
                this.callApi = router.apiCalls.includeRecipient;
                yield router.route(app, this);
            });

        app.route('/iris/process/batch')
            .post(function *(next) {
                this.callApi = router.apiCalls.processACHBatch;
                yield router.route(app, this);
            });

        app.route('/iris/reinitiate/batch')
            .post(function *(next) {
                this.callApi = router.apiCalls.reinitiateACHBatch;
                yield router.route(app, this);
            });

        app.route('/iris/approve/batch')
            .post(function *(next) {
                this.callApi = router.apiCalls.authorizeBatch;
                yield router.route(app, this);
            });

        app.route('/iris/decline/batch')
            .post(function *(next) {
                this.callApi = router.apiCalls.deAuthorizeBatch;
                yield router.route(app, this);
            });

        app.route('/iris/list/batch')
            .post(function *(next) {
                this.callApi = router.apiCalls.allBatch;
                yield router.route(app, this);
            });

        app.route('/iris/list/pending/batch')
            .post(function *(next) {
                this.callApi = router.apiCalls.pendingBatch;
                yield router.route(app, this);
            });

        app.route('/iris/list/editable/batch')
            .post(function *(next) {
                this.callApi = router.apiCalls.editableBatch;
                yield router.route(app, this);
            });

        app.route('/iris/batch/recipient')
            .post(function *(next) {
                this.callApi = router.apiCalls.batchRecipient;
                yield router.route(app, this);
            });

        app.route('/iris/routing/number')
            .post(function *(next) {
                this.callApi = router.apiCalls.routingNumber;
                yield router.route(app, this);
            });

        app.route('/iris/upload/ach')
            .post(function *(next) {
                this.callApi = router.apiCalls.uploadAchFile;
                yield router.route(app, this);
            });

        app.route('/iris/ach/list')
            .post(function *(next) {
                this.callApi = router.apiCalls.listAchFile;
                yield router.route(app, this);
            });

        app.route('/iris/list/achbatch')
            .post(function *(next) {
                this.callApi = router.apiCalls.listAchFileBatch;
                yield router.route(app, this);
            });

        app.route('/iris/ach/batch/process')
            .post(function *(next) {
                this.callApi = router.apiCalls.batchProcessAch;
                yield router.route(app, this);
            });

        app.route('/iris/ach/batch/remove')
            .post(function *(next) {
                this.callApi = router.apiCalls.batchRemoveAch;
                yield router.route(app, this);
            });

        app.route('/iris/add/user')
            .post(function *(next) {
                this.callApi = router.apiCalls.enrollUser;
                yield router.route(app, this);
            });

        app.route('/iris/add/direct')
            .post(function *(next) {
                this.callApi = router.apiCalls.directEnroll;
                yield router.route(app, this);
            });

        app.route('/iris/change/security/question')
            .post(function *(next) {
                this.callApi = router.apiCalls.changeSQ;
                yield router.route(app, this);
            });

        app.route('/iris/change/password')
            .post(function *(next) {
                this.callApi = router.apiCalls.changeUP;
                yield router.route(app, this);
            });

        app.route('/iris/change/personal/info')
            .post(function *(next) {
                this.callApi = router.apiCalls.changePI;
                yield router.route(app, this);
            });

        app.route('/iris/show/policy')
            .post(function *(next) {
                this.callApi = router.apiCalls.getBankPolicy;
                yield router.route(app, this);
            });

        app.route('/iris/validate/otp')
            .post(function *(next) {
                this.callApi = router.apiCalls.validateOtp;
                yield router.route(app, this);
            });

        app.route('/iris/validate/forgot/password/otp')
            .post(function *(next) {
                this.callApi = router.apiCalls.forgotPasswordOtp;
                yield router.route(app, this);
            });

        ///////////////////////////////////////

        app.route('/iris/supervisor/add/user')
            .post(function *(next) {
                this.callApi = router.apiCalls.addBYSupervisor;
                yield router.route(app, this);
            });
        app.route('/iris/supervisor/update/user')
            .post(function *(next) {
                this.callApi = router.apiCalls.updateBYSupervisor;
                yield router.route(app, this);
            });
        app.route('/iris/statements/enrollment')
            .post(function *(next) {
                this.callApi = router.apiCalls.statementsEnrollment;
                yield router.route(app, this);
            });
        app.route('/iris/supervisor/edit/limits')
            .post(function *(next) {
                this.callApi = router.apiCalls.changeUTL;
                yield router.route(app, this);
            });
        app.route('/iris/supervisor/edit/profile')
            .post(function *(next) {
                this.callApi = router.apiCalls.changeSUP;
                yield router.route(app, this);
            });

        app.route('/iris/supervisor/edit/account/access')
            .post(function *(next) {
                this.callApi = router.apiCalls.changeUAA;
                yield router.route(app, this);
            });

        app.route('/iris/supervisor/edit/user/views')
            .post(function *(next) {
                this.callApi = router.apiCalls.changeUVA;
                yield router.route(app, this);
            });

        app.route('/iris/supervisor/change/question')
            .post(function *(next) {
                this.callApi = router.apiCalls.changeUSQ;
                yield router.route(app, this);
            });

        app.route('/iris/supervisor/list/user')
            .post(function *(next) {
                this.callApi = router.apiCalls.listSCreatedUser;
                yield router.route(app, this);
            });

        app.route('/iris/supervisor/unlock/user')
            .post(function *(next) {
                this.callApi = router.apiCalls.unLockBySupervisor;
                yield router.route(app, this);
            });

        app.route('/iris/supervisor/delete/user')
            .post(function *(next) {
                this.callApi = router.apiCalls.deleteUser;
                yield router.route(app, this);
            });

        app.route('/iris/add/reminder')
            .post(function *(next) {
                this.callApi = router.apiCalls.addReminder;
                yield router.route(app, this);
            });

        app.route('/iris/edit/reminder')
            .post(function *(next) {
                this.callApi = router.apiCalls.editReminder;
                yield router.route(app, this);
            });

        app.route('/iris/delete/reminder')
            .post(function *(next) {
                this.callApi = router.apiCalls.deleteReminder;
                yield router.route(app, this);
            });

        app.route('/iris/show/reminder')
            .post(function *(next) {
                this.callApi = router.apiCalls.showReminder;
                yield router.route(app, this);
            });

        app.route('/iris/list/reminder')
            .post(function *(next) {
                this.callApi = router.apiCalls.listReminder;
                yield router.route(app, this);
            });

        app.route('/iris/add/alert')
            .post(function *(next) {
                this.callApi = router.apiCalls.addAlert;
                yield router.route(app, this);
            });

        app.route('/iris/edit/alert')
            .post(function *(next) {
                this.callApi = router.apiCalls.editAlert;
                yield router.route(app, this);
            });

        app.route('/iris/delete/alert')
            .post(function *(next) {
                this.callApi = router.apiCalls.deleteAlert;
                yield router.route(app, this);
            });

        app.route('/iris/deenroll/accountnumber')
            .post(function *(next) {
                this.callApi = router.apiCalls.deEnrollAccountNumbers;
                yield router.route(app, this);
            });

        app.route('/iris/list/alert')
            .post(function *(next) {
                this.callApi = router.apiCalls.listAlert;
                yield router.route(app, this);
            });

        app.route('/iris/view/enrollments')
            .post(function *(next) {
                this.callApi = router.apiCalls.enrollmentsList;
                yield router.route(app, this);
            });

        app.route('/iris/stop/payment')
            .post(function *(next) {
                this.callApi = router.apiCalls.addPayment;
                yield router.route(app, this);
            });

        app.route('/iris/list/stop/payment')
            .post(function *(next) {
                this.callApi = router.apiCalls.listPayment;
                yield router.route(app, this);
            });

        app.route('/iris/delete/stop/payment')
            .post(function *(next) {
                this.callApi = router.apiCalls.deletePayment;
                yield router.route(app, this);
            });

        app.route('/iris/add/beneficiary')
            .post(function *(next) {
                this.callApi = router.apiCalls.addBeneficiary;
                yield router.route(app, this);
            });

        app.route('/iris/edit/beneficiary')
            .post(function *(next) {
                this.callApi = router.apiCalls.editBeneficiary;
                yield router.route(app, this);
            });

        app.route('/iris/list/beneficiary')
            .post(function *(next) {
                this.callApi = router.apiCalls.listBeneficiary;
                yield router.route(app, this);
            });

        app.route('/iris/delete/beneficiary')
            .post(function *(next) {
                this.callApi = router.apiCalls.deleteBeneficiary;
                yield router.route(app, this);
            });

        app.route('/iris/add/wire/transfer')
            .post(function *(next) {
                this.callApi = router.apiCalls.addWireTransfer;
                yield router.route(app, this);
            });

        app.route('/iris/list/wire/transfer')
            .post(function *(next) {
                this.callApi = router.apiCalls.listWireTransfer;
                yield router.route(app, this);
            });

        app.route('/iris/authorize/wire/transfer')
            .post(function *(next) {
                this.callApi = router.apiCalls.authorizeWireTransfer;
                yield router.route(app, this);
            });

        app.route('/iris/delete/wire/transfer')
            .post(function *(next) {
                this.callApi = router.apiCalls.deleteWireTransfer;
                yield router.route(app, this);
            });

        app.route('/iris/order/check')
            .post(function *(next) {
                this.callApi = router.apiCalls.orderCheck;
                yield router.route(app, this);
            });

        app.route('/iris/send/mail')
            .post(function *(next) {
                this.callApi = router.apiCalls.sendEmailFromUser;
                yield router.route(app, this);
            });

        app.route('/iris/mail/inbox')
            .post(function *(next) {
                this.callApi = router.apiCalls.listUserInbox;
                yield router.route(app, this);
            });

        app.route('/iris/mail/sent')
            .post(function *(next) {
                this.callApi = router.apiCalls.listUserSentBox;
                yield router.route(app, this);
            });

        app.route('/iris/mail/trash')
            .post(function *(next) {
                this.callApi = router.apiCalls.listUserTrashBox;
                yield router.route(app, this);
            });

        app.route('/iris/trash/message')
            .post(function *(next) {
                this.callApi = router.apiCalls.userMailToTrashBox;
                yield router.route(app, this);
            });

        app.route('/iris/reply/message')
            .post(function *(next) {
                this.callApi = router.apiCalls.userMailReply;
                yield router.route(app, this);
            });

        app.route('/iris/read/message')
            .post(function *(next) {
                this.callApi = router.apiCalls.userMailRead;
                yield router.route(app, this);
            });

        app.route('/iris/delete/trash')
            .post(function *(next) {
                this.callApi = router.apiCalls.userMailDelete;
                yield router.route(app, this);
            });

        //BANK ADMIN API
        app.route('/iris/admin/create')
            .post(function *(next) {
                this.callApi = router.apiCalls.createBankAdmin;
                yield router.route(app, this);
            });

        app.route('/iris/admin/edit')
            .post(function *(next) {
                this.callApi = router.apiCalls.editBankAdmin;
                yield router.route(app, this);
            });
        app.route('/iris/admin/changestatus')
            .post(function *(next) {
                this.callApi = router.apiCalls.changeStatusBankAdmin;
                yield router.route(app, this);
            });

        app.route('/iris/admin/list')
            .post(function *(next) {
                this.callApi = router.apiCalls.listBankAdmin;
                yield router.route(app, this);
            });

        app.route('/iris/admin/change/password')
            .post(function *(next) {
                this.callApi = router.apiCalls.bankAdminChangePassword;
                yield router.route(app, this);
            });

        app.route('/iris/admin/availability')
            .post(function *(next) {
                this.callApi = router.apiCalls.bankAdminAvailability;
                yield router.route(app, this);
            });

        app.route('/iris/admin/add/password/rule')
            .post(function *(next) {
                this.callApi = router.apiCalls.addBankPasswordRule;
                yield router.route(app, this);
            });

        app.route('/iris/admin/edit/password/rule')
            .post(function *(next) {
                this.callApi = router.apiCalls.changeBankPasswordRule;
                yield router.route(app, this);
            });

        app.route('/iris/admin/show/password/rule')
            .post(function *(next) {
                this.callApi = router.apiCalls.getBankPasswordRule;
                yield router.route(app, this);
            });

        app.route('/iris/admin/login')
            .post(function *(next) {
                var secret = this.session.secret;
                //this.session.cookie.path = '/admin/'
                yield this.regenerateSession();
                this.session.secret = secret;
                this.callApi = router.apiCalls.bankAdminLogin;
                yield router.route(app, this);
            });

        app.route('/iris/admin/add/policy')
            .post(function *(next) {
                this.callApi = router.apiCalls.addBankPolicy;
                yield router.route(app, this);
            });

        app.route('/iris/admin/change/policy')
            .post(function *(next) {
                this.callApi = router.apiCalls.changeBankPolicy;
                yield router.route(app, this);
            });

        app.route('/iris/admin/show/policy')
            .post(function *(next) {
                this.callApi = router.apiCalls.getBankPolicy;
                yield router.route(app, this);
            });

        app.route('/iris/admin/logout')
            .post(function *(next) {
                this.callApi = router.apiCalls.bankAdminLogout;
                yield router.route(app, this);
            });

        app.route('/iris/search/customer')
            .post(function *(next) {
                this.callApi = router.apiCalls.searchCustomer;
                yield router.route(app, this);
            });

        app.route('/iris/exclusion/search/customer')
            .post(function *(next) {
                this.callApi = router.apiCalls.exclusionSearchCustomer;
                yield router.route(app, this);
            });

        app.route('/iris/admin/account/exclusion')
            .post(function *(next) {
                this.callApi = router.apiCalls.accExclusionForCustomer;
                yield router.route(app, this);
            });

        app.route('/iris/add/accesstype')
            .post(function *(next) {
                this.callApi = router.apiCalls.addAccessTypes;
                yield router.route(app, this);
            });

        app.route('/iris/edit/accesstype')
            .post(function *(next) {
                this.callApi = router.apiCalls.editAccessType;
                yield router.route(app, this);
            });

        app.route('/iris/list/accesstype')
            .post(function *(next) {
                this.callApi = router.apiCalls.listAccessTypes;
                yield router.route(app, this);
            });

        app.route('/iris/list/locked')
            .post(function *(next) {
                this.callApi = router.apiCalls.listLockedUser;
                yield router.route(app, this);
            });

        app.route('/iris/unlock')
            .post(function *(next) {
                this.callApi = router.apiCalls.unLockUser;
                yield router.route(app, this);
            });

        app.route('/iris/admin/inactive/users')
            .post(function *(next) {
                this.callApi = router.apiCalls.inActiveUser;
                yield router.route(app, this);
            });

        app.route('/iris/admin/report/active/users')
            .post(function *(next) {
                this.request.body.download = true;
                this.callApi = router.apiCalls.activeUser;
                yield router.route(app, this);
            })
            .put(function *(next) {
                this.request.body.download = false;
                this.callApi = router.apiCalls.activeUser;
                yield router.route(app, this);
            });

        app.route('/iris/find/users')
            .post(function *(next) {
                this.callApi = router.apiCalls.findUser;
                yield router.route(app, this);
            });

        app.route('/iris/admin/delete/user')
            .post(function *(next) {
                this.callApi = router.apiCalls.deleteUserByAdmin;
                yield router.route(app, this);
            });

        app.route('/iris/admin/user/activity')
            .post(function *(next) {
                this.callApi = router.apiCalls.userActivityReport;
                this.request.body.download = 'no';
                yield router.route(app, this);
            });

        app.route('/iris/reset/password')
            .post(function *(next) {
                this.callApi = router.apiCalls.resetPassword;
                yield router.route(app, this);
            });

        app.route('/iris/admin/resetPassword')
            .post(function *(next) {
                this.callApi = router.apiCalls.resetPasswordBankAdmin;
                yield router.route(app, this);
            });

        app.route('/iris/reset/securityq')
            .post(function *(next) {
                this.callApi = router.apiCalls.resetSecurityQ;
                yield router.route(app, this);
            });

        app.route('/iris/search/invalid/login')
            .post(function *(next) {
                this.callApi = router.apiCalls.inValidLogin;
                this.request.body.download = 'no';
                yield router.route(app, this);
            });

        app.route('/iris/session/report')
            .post(function *(next) {
                this.callApi = router.apiCalls.sessionReport;
                this.request.body.download = 'no';
                yield router.route(app, this);
            });

        app.route('/iris/downtime/report')
            .post(function *(next) {
                this.callApi = router.apiCalls.downTimeReport;
                this.request.body.download = 'no';
                yield router.route(app, this);
            });

        app.route('/iris/client/activity/report')
            .post(function *(next) {
                this.callApi = router.apiCalls.clientActivityReport;
                this.request.body.download = 'no';
                yield router.route(app, this);
            });

        app.route('/iris/reconciliation/users/report')
            .post(function *(next) {
                this.request.body.download = true;
                this.callApi = router.apiCalls.reconciliationUsersReport;
                yield router.route(app, this);
            })
            .put(function *(next) {
                this.request.body.download = false;
                this.callApi = router.apiCalls.reconciliationUsersReport;
                yield router.route(app, this);
            });

        app.route('/iris/session/report/download')
            .post(function *(next) {
                this.callApi = router.apiCalls.fileDownload;
                this.gotoRequest = 'sessionReport';
                yield router.route(app, this);

            });

        app.route('/iris/admin/user/activity/download')
            .post(function *(next) {
                this.callApi = router.apiCalls.fileDownload;
                this.gotoRequest = 'userActivity';
                yield router.route(app, this);
            });

        app.route('/iris/search/invalid/login/download')
            .post(function *(next) {
                this.callApi = router.apiCalls.fileDownload;
                this.gotoRequest = 'inactiveLogin';
                yield router.route(app, this);
            });

        app.route('/iris/admin/send/mail')
            .post(function *(next) {
                this.callApi = router.apiCalls.sendEmailFromAdmin;
                yield router.route(app, this);
            });

        app.route('/iris/admin/mail/inbox')
            .post(function *(next) {
                this.callApi = router.apiCalls.listAdminInbox;
                yield router.route(app, this);
            });

        app.route('/iris/admin/mail/sent')
            .post(function *(next) {
                this.callApi = router.apiCalls.listAdminSentBox;
                yield router.route(app, this);
            });

        app.route('/iris/admin/mail/trash')
            .post(function *(next) {
                this.callApi = router.apiCalls.listAdminTrashBox;
                yield router.route(app, this);
            });

        app.route('/iris/admin/trash/message')
            .post(function *(next) {
                this.callApi = router.apiCalls.adminMailToTrashBox;
                yield router.route(app, this);
            });

        app.route('/iris/admin/reply/message')
            .post(function *(next) {
                this.callApi = router.apiCalls.adminMailReply;
                yield router.route(app, this);
            });

        app.route('/iris/admin/read/message')
            .post(function *(next) {
                this.callApi = router.apiCalls.adminMailRead;
                yield router.route(app, this);
            });

        app.route('/iris/admin/delete/trash')
            .post(function *(next) {
                this.callApi = router.apiCalls.adminMailDelete;
                yield router.route(app, this);
            });

        app.route('/iris/admin/pagehit/overview')
            .post(function *(next) {
                this.callApi = router.apiCalls.pageHitOverview;
                yield router.route(app, this);
            });

        app.route('/iris/admin/pagehit/page')
            .post(function *(next) {
                this.callApi = router.apiCalls.pageHitPage;
                yield router.route(app, this);
            });

        app.route('/iris/admin/pagehit/customer')
            .post(function *(next) {
                this.callApi = router.apiCalls.pageHitCustomer;
                yield router.route(app, this);
            });

        app.route('/iris/admin/show/wording')
            .post(function *(next) {
                this.callApi = router.apiCalls.getMailWording;
                yield router.route(app, this);
            });

        app.route('/iris/admin/add/wording')
            .post(function *(next) {
                this.callApi = router.apiCalls.addMailWording;
                yield router.route(app, this);
            });

        app.route('/iris/admin/edit/wording')
            .post(function *(next) {
                this.callApi = router.apiCalls.editMailWording;
                yield router.route(app, this);
            });

        app.route('/iris/admin/print/userid')
            .post(function *(next) {
                this.callApi = router.apiCalls.printUserIdTemplate;
                yield router.route(app, this);
            });

        app.route('/iris/admin/print/password')
            .post(function *(next) {
                this.callApi = router.apiCalls.printPasswordTemplate;
                yield router.route(app, this);
            });

        app.route('/iris/admin/add/image')
            .post(function *(next) {
                this.callApi = router.apiCalls.uploadSiteImage;
                yield router.route(app, this);
            });

        app.route('/iris/admin/delete/image')
            .post(function *(next) {
                this.callApi = router.apiCalls.deleteSiteImage;
                yield router.route(app, this);
            });

        app.route('/iris/admin/site/images')
            .post(function *(next) {
                this.callApi = router.apiCalls.listSiteImage;
                yield router.route(app, this);
            });

        app.route('/iris/admin/apply/site')
            .post(function *(next) {
                this.callApi = router.apiCalls.applySiteChange;
                yield router.route(app, this);
            });
        app.route('/iris/admin/apply/site/overview')
            .post(function *(next) {
                this.callApi = router.apiCalls.applySiteOverviewChanges;
                yield router.route(app, this);
            });

        app.route('/iris/admin/add/language')
            .post(function *(next) {
                this.callApi = router.apiCalls.updateSiteLanguage;
                yield router.route(app, this);
            });

        app.route('/iris/list/language')
            .post(function *(next) {
                this.callApi = router.apiCalls.listSiteLanguage;
                yield router.route(app, this);
            });
        app.route('/iris/user/updatenickname')
            .post(function *(next) {
                this.callApi = router.apiCalls.updateNickName;
                yield router.route(app, this);
            });

        app.route('/iris/show/otp/config')
            .post(function *(next) {
                this.callApi = router.apiCalls.showOtpConfig;
                yield router.route(app, this);
            });

        app.route('/iris/update/otp/config')
            .post(function *(next) {
                this.callApi = router.apiCalls.updateOtpConfig;
                yield router.route(app, this);
            });

        app.route('/iris/admin/configuration/limitprofile/new')
            .post(function *(next) {
                this.callApi = router.apiCalls.limitProfileNew;
                yield router.route(app, this);
            });

        app.route('/iris/admin/configuration/limitprofile/edit')
            .post(function *(next) {
                this.callApi = router.apiCalls.limitProfileEdit;
                yield router.route(app, this);
            });
        app.route('/iris/admin/configuration/limitprofile/delete')
            .post(function *(next) {
                this.callApi = router.apiCalls.limitProfileDelete;
                yield router.route(app, this);
            });


        app.route('/iris/admin/configuration/limitprofile/list')
            .post(function *(next) {
                this.callApi = router.apiCalls.limitProfilesList;
                yield router.route(app, this);
            });

        app.route('/iris/admin/configuration/limitprofile/users/list')
            .post(function *(next) {
                this.callApi = router.apiCalls.limitProfileUsersList;
                yield router.route(app, this);
            });

        app.route('/iris/admin/configuration/limitprofile/users/override')
            .post(function *(next) {
                this.callApi = router.apiCalls.overrideLimitProfileForUser;
                yield router.route(app, this);
            });
        app.route('/iris/add/thirdpartybeneficiary')
            .post(function *(next) {
                this.callApi = router.apiCalls.addThirdPartyBeneficiary;
                yield router.route(app, this);
            });
        app.route('/iris/edit/thirdpartybeneficiary')
            .post(function *(next) {
                this.callApi = router.apiCalls.editThirdPartyBeneficiary;
                yield router.route(app, this);
            });

        app.route('/iris/list/thirdpartybeneficiary')
            .post(function *(next) {
                this.callApi = router.apiCalls.listThirdPartyBeneficiary;
                yield router.route(app, this);
            });

        app.route('/iris/delete/thirdpartybeneficiary')
            .post(function *(next) {
                this.callApi = router.apiCalls.deleteThirdPartyBeneficiary;
                yield router.route(app, this);
            });

        app.route('/iris/deletePending/thirdpartybeneficiary')
            .post(function *(next) {
                this.callApi = router.apiCalls.deletePendingThirdPartyBeneficiary;
                yield router.route(app, this);
            });

        app.route('/iris/customersearch')
            .post(function *(next) {
                this.callApi = router.apiCalls.customerSearch;
                yield router.route(app, this);
            });

        app.route('/iris/admin/enrollandprint')
            .post(function *(next) {
                this.callApi = router.apiCalls.enrollAndPrint;
                yield router.route(app, this);
            });

        app.route('/iris/admin/enrollandmail')
            .post(function *(next) {
                this.callApi = router.apiCalls.enrollAndMail;
                yield router.route(app, this);
            });
        app.route('/iris/admin/desiredenroll')
            .post(function *(next) {
                this.callApi = router.apiCalls.desiredEnroll;
                yield router.route(app, this);
            });
        app.route('/iris/admin/reactivate/user')
            .post(function *(next) {
                this.callApi = router.apiCalls.reactivateUser;
                yield router.route(app, this);
            });

        app.route('/iris/admin/overrideaccesstype')
            .post(function *(next) {
                this.callApi = router.apiCalls.overrideaccesstype;
                yield router.route(app, this);
            });

        app.route('/iris/user/contactdetails')
            .post(function *(next) {
                this.callApi = router.apiCalls.getContactDetailsForUser;
                yield router.route(app, this);
            });

        app.route('/iris/user/available/day/limits')
            .post(function *(next) {
                this.callApi = router.apiCalls.userLimits;
                yield router.route(app, this);
            });

        // app.route('/iris/file/:userId/:date/:fileName/:fileExt')
        app.route('/iris/file/:jwt')
            .get(function *(next) {
                this.callApi = router.apiCalls.getFile;
                var filePath = yield router.route(app, this);
                this.set('Content-type', 'application/octet-stream');
                this.set('Content-disposition', 'filename=' + filePath.fileName + "." + filePath.fileExt);//attachment;
                yield send(this, filePath.filePath);
            }).post(function *(next) {
            this.callApi = router.apiCalls.getFile;
            var filePath = yield router.route(app, this);
            this.set('Content-type', 'application/octet-stream');
            this.set('Content-disposition', 'attachment; filename=' + filePath.fileName + "." + filePath.fileExt);//attachment;
            yield send(this, filePath.filePath);
        });

        app.route('/iris/eodextract/download')
            .post(function *(next) {
                this.callApi = router.apiCalls.eodExtractDownload;
                this.doDownload = true;
                var filePath = yield router.route(app, this);
                this.set('Content-type', 'application/octet-stream');
                this.set('Content-disposition', 'attachment; filename=' + filePath.body.responseData.fileName + '.' + filePath.body.responseData.fileExt);
                yield send(this, filePath.body.responseData.filePath);
            }).put(function *(next) {
            this.callApi = router.apiCalls.eodExtractDownload;
            this.doDownload = false;
            yield router.route(app, this);

        });
        app.route('/iris/generateCaptcha')
            .get(function *(next) {
                this.callApi = router.apiCalls.generateCaptcha;
                yield router.route(app, this);
            });

        var capture = app.route('/iris/capture')

        var deposit = capture.nested('/deposit')

        deposit.nested('/checks')
            .post(function * (next) {
                this.callApi = router.apiCalls.depositCheck;
                yield router.route(app , this);
            })
            .put(function * (next) {
                this.callApi = router.apiCalls.deleteCheck;
                yield router.route(app , this);
            });
        deposit.nested('/transmit')
            .post(function * (next) {
                this.callApi = router.apiCalls.depositTransmit;
                yield router.route(app , this);
            })
            .put(function * (next) {
                this.callApi = router.apiCalls.deleteDeposit;
                yield router.route(app , this);
            });
        var history = capture.nested('/history');
        history.nested('/list')
            .get(function * (next) {
                this.callApi = router.apiCalls.checkDepositHistroy;
                yield router.route(app , this);
            });

    };
})();