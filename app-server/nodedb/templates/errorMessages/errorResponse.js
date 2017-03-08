(function(){

    module.exports = function(config){
        return {
            NoRecordFound: {
                status: 400,
                responseData: {
                    message: 'No Record Found'
                }
            },
            ZZ:{
                status: 400,
                responseData: {
                    message: "Core Response Failed"
                }},
            1001:{
                status: 400,
                responseData: {
                    message: "Account Not Available"
                }
            },
            1002: {
                status: 400,
                responseData: {
                    message: "ACCOUNTOWNER_INFO_NOT_AVAILABLE"
                }
            },
            1003:{
                status: 400,
                responseData: {
                    message: "INVALID_ACCOUNT_STATUS"
                }
            },
            1004:{
                status: 400,
                responseData: {
                    message: "INSUFFICIENT_BALANCE"
                }
            },
            2001:{
                status: 400,
                responseData: {
                    message: "CUSTOMER_INFO_NOT_AVAILABLE"
                }
            },
            3001:{
                status: 400,
                responseData: {
                    message: "TRANSACTION_INFO_NOT_AVAILABLE"
                }
            },
            3002:{
                status: 400,
                responseData: {
                    message: "Transaction code Information Not Available"
                }
            },
            4001:{
                status: 400,
                responseData: {
                    message: "INSTITUTION_NOT_AVAILABLE"
                }
            },
            9001:{
                status: 400,
                responseData: {
                    message: "REQUESTED_ACTION_IS_NOT_POSSIBLE"
                }
            },
            9999:{
                status: 400,
                responseData: {
                    message: "GENERAL_ERROR"
                }
            },
            9000:{
                status: 400,
                responseData: {
                    message: "VALIDATION_ERROR"
                }
            },
            9002:{
                status: 400,
                responseData: {
                    message: "REQUIRED_FIELD_NOT_INCLUDED"
                }
            },
            500:{
                status: 400,
                responseData: {
                    message: "Core Response Failed"
                }
            },
            RF:{
                status: 400,
                responseData: {
                    message: "Core Not Available"
                }
            },
            00:{
                status: 400,
                responseData: {
                    message: "SUCCESS"
                }
            },
            AuthorisationFailed: {
                status: 400,
                responseData: {
                    message: 'You are not Authorised to Access this Service. Please contact Bank Admin'
                }
            },
            UserCreationFailed: {
                status: 400,
                responseData: {
                    message: 'UserName already Registered'
                }
            },
            UserNotFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Invalid UserName'
                }
            },
            UserIDNotFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Invalid Recipients User ID'
                }
            },
            UserNotEnrolledFailed: {
                status: 400,
                responseData: {
                    message: 'Forgot password is not applicable for not enrolled customers'
                }
            },
            SecurityQuestionsPasswordReset: {
                status: 400,
                responseData: {
                    message: 'Para su protección esa petición no puede completarse en línea. Por favor contacte con su el apoyo del Banco.'
                }
            },
            EmailNotFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Invalid Email Address'
                }
            },
            UserIdComplianceFailed: {
                status: 400,
                responseData: {
                    message: 'Please enter a valid Username'
                }
            },
            PasswordComplianceFailed: {
                status: 400,
                responseData: {
                    message: 'Please enter a valid Password'
                }
            },
            NewInfoFailed: {
                status: 400,
                responseData: {
                    message: 'Please enter New UserId/Password'
                }
            },
            UserExistsFailed: {
                status: 400,
                responseData: {
                    message: 'UserId Already Exists. Please check the availability of the UserId'
                }
            },
            InCorrectPasswordFailed: {
                status: 400,
                responseData: {
                    message: 'The old password you entered was incorrect'
                }
            },
            SamePasswordFailed: {
                status: 400,
                responseData: {
                    message: 'The password entered has already been used. Please enter a new password'
                }
            },
            UserSQValidationFailed: {
                status: 400,
                responseData: {
                    message: 'Incorrect Answer'
                }
            },
            InCorrectRetryError: {
                status: 400,
                responseData: {
                    message: 'Account Locked. Due to multiple incorrect Login attempts ,your account is now locked. Please contact helpline'
                },
                nextStep: config.nextStepTo.goToLogin
            },
            AccessTypeFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Incorrect AccessType'
                }
            },
            AccessTypeExistsFailed: {
                status: 400,
                responseData: {
                    message: 'AccessType Already Exists'
                }
            },
            UserLoginFailed: {
                status: 400,
                responseData: {
                    message: 'Incorrect UserName/Password'
                }
            },
            UserLoginFailedLocked: {
                status: 400,
                responseData: {
                    message: 'Admin is Locked. Please Contact Your Supervisor'
                }
            },
            UserLoginFailedDeleted: {
                status: 400,
                responseData: {
                    message: 'Admin Credentials Have Been Revoked. Please Contact Your Supervisor'
                }
            },
            MultipleLoginError: {
                status: 400,
                responseData: {
                    message: 'You are Already Logged In. Multiple login is not allowed'
                },
                nextStep: config.nextStepTo.goToLogin
            },
            InCorrectRequestError: {
                status: 400,
                responseData: {
                    message: 'Incorrect Request was provided'
                }
            },
            SessionCreationFailed: {
                status: 400,
                responseData: {
                    message: 'Incorrect Request .Session Creation failed'
                }
            },
            BatchCreationFailed: {
                status: 400,
                responseData: {
                    message: 'Failed to create the Batch'
                }
            },
            BatchExistsFailed: {
                status: 400,
                responseData: {
                    message: 'Batch Already exists.Please Change the batch name'
                }
            },
            FileUploadFailed: {
                status: 400,
                responseData: {
                    message: 'File upload Rejected. Please upload the text file'
                }
            },
            BatchRetrieveFailed: {
                status: 400,
                responseData: {
                    message: 'Batch not available'
                }
            },
            BankPolicySaveFailed: {
                status: 400,
                responseData: {
                    message: 'The Bank policy could not be saved'
                }
            },
            BatchAuthorizeFailed: {
                status: 400,
                responseData: {
                    message: 'Failed to authorize the Batch'
                }
            },
            BatchEmptyAuthorizeFailed: {
                status: 400,
                responseData: {
                    message: 'Failed to authorize the empty Batch'
                }
            },
            BatchDeAuthorizeFailed: {
                status: 400,
                responseData: {
                    message: 'Failed to De-authorize the Batch'
                }
            },
            OperationFailed: {
                status: 400,
                responseData: {
                    message: 'The operation Failed'
                }
            },
            SameReminderFailed: {
                status: 400,
                responseData: {
                    message: 'Reminder is already set for selected date'
                }
            },
            SameAlertFailed: {
                status: 400,
                responseData: {
                    message: 'Alert is already set'
                }
            },
            TransactionLimitFailed: {
                status: 400,
                responseData: {
                    message: 'You have exceeded the Limit per Day'
                }
            },
            RecipientCreationFailed: {
                status: 400,
                responseData: {
                    message: 'Failed to create the Recipient'
                }
            },
            RoutingNumberFailed: {
                status: 400,
                responseData: {
                    message: 'Please enter a valid recipient bank routing number'
                }
            },
            IntermediateRoutingNumberFailed: {
                status: 400,
                responseData: {
                    message: 'Please enter a valid intermediary bank routing number'
                }
            },
            RecipientRetrieveFailed: {
                status: 400,
                responseData: {
                    message: 'Recipient not available'
                }
            },
            SessionTimeout: {
                status: 401,
                responseData: {
                    message: 'Session has Expired. Please login again'
                }
            },
            ConfigurationFailed: {
                status: 400,
                responseData: {
                    message: 'Configuration Already created'
                }
            },
            IncorrectOTPFailed: {
                status: 400,
                responseData: {
                    message: 'Incorrect OTP Entered'
                }
            },
            OTPServiceNotRegisteredFailed: {
                status: 400,
                responseData: {
                    message: 'The Otp Service is not registered. Please check available services'
                }
            },
            LimitProfileExistsFailed: {
                status: 400,
                responseData: {
                    message: 'Limit Profile Already Exists With Given Name'
                }
            },
            LimitProfileListFoundFailed: {
                status: 400,
                responseData: {
                    message: 'No Profile Exist'
                }
            },
            AccountAlreadyExist: {
                status: 400,
                responseData: {
                    message: 'Account Already Exist'
                }
            },
            AccountNotAllowedForTransfer: {
                status: 400,
                responseData: {
                    message: 'Account Not Allowed For Transfer'
                }
            },
            OwnAccountNotAllowedAsRecipient: {
                status: 400,
                responseData: {
                    message: 'Own Account Not Allowed For Third Party Recipient'
                }
            },
            LimitProfileLinkedAccessTypeFailed : {
                status: 400,
                responseData: {
                    message: 'Limit Profile is Linked with Access Type, it can not be deleted'
                }
            },
            LimitProfileLinkedUserFailed : {
                status: 400,
                responseData: {
                    message: 'Limit Profile is Linked with Users, it can not be deleted'
                }
            },
            CreateAlert : {
                status: 400,
                responseData: {
                    message: 'Failed to setup the Alert'
                }
            },
            UpdateAlert : {
                status: 400,
                responseData: {
                    message: 'Failed to update the Alert'
                }
            },
            DeleteAlert : {
                status: 400,
                responseData: {
                    message: 'Failed to delete the selected Alert(s)'
                }
            },
            CustomerAlreadyRegistered: {
                status: 400,
                responseData: {
                    message: 'Customer Already Registered'
                }
            },
            OTPTimeOut: {
                status: 400,
                responseData: {
                    message: 'OTP Timed-Out'
                }
            },
            OTPNotFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Invalid Request Details'
                }
            },

        }
    };
})();