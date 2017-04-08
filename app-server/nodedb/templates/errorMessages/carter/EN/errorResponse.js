(function(){

    module.exports = function(config){
        return {
            NoRecordFound: {
                status: 400,
                responseData: {
                    message: 'No record found'
                }
            },
            ZZ:{
                status: 400,
                responseData: {
                    message: "Core response failed"
                }},
            1001:{
                status: 400,
                responseData: {
                    message: "Account not available"
                }
            },
            1002: {
                status: 400,
                responseData: {
                    message: "Account owner information not available"
                }
            },
            1003:{
                status: 400,
                responseData: {
                    message: "Invalid account status"
                }
            },
            1004:{
                status: 400,
                responseData: {
                    message: "Insufficient balance"
                }
            },
            2001:{
                status: 400,
                responseData: {
                    message: "Customer information not available"
                }
            },
            3001:{
                status: 400,
                responseData: {
                    message: "Transaction information not available"
                }
            },
            3002:{
                status: 400,
                responseData: {
                    message: "Transaction code information not available"
                }
            },
            4001:{
                status: 400,
                responseData: {
                    message: "Institution not available"
                }
            },
            9001:{
                status: 400,
                responseData: {
                    message: "Requested action is not possible"
                }
            },
            9999:{
                status: 400,
                responseData: {
                    message: "General error"
                }
            },
            9000:{
                status: 400,
                responseData: {
                    message: "Validation error"
                }
            },
            9002:{
                status: 400,
                responseData: {
                    message: "Required field not included"
                }
            },
            500:{
                status: 400,
                responseData: {
                    message: "Core not available"
                }
            },
            RF:{
                status: 400,
                responseData: {
                    message: "Core not available"
                }
            },
            00:{
                status: 400,
                responseData: {
                    message: "Success"
                }
            },
            AuthorisationFailed: {
                status: 400,
                responseData: {
                    message: 'You are not authorized to access this service.Please contact a bank administrator'
                }
            },
            UserCreationFailed: {
                status: 400,
                responseData: {
                    message: 'Username unavailable'
                }
            },
            UserNotFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Invalid username'
                }
            },
            UserIDNotFoundFailed: {
                status: 400,
                responseData: {
                    message: "Invalid recipient's user ID"
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
                    message: ' For your protection this request cannot be completed online. Please contact your bank support.'
                }
            },
            EmailNotFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Invalid email address'
                }
            },
            UserIdComplianceFailed: {
                status: 400,
                responseData: {
                    message: 'Please enter a valid username'
                }
            },
            PasswordComplianceFailed: {
                status: 400,
                responseData: {
                    message: 'Please enter a valid password'
                }
            },
            NewInfoFailed: {
                status: 400,
                responseData: {
                    message: 'Please enter new user ID/Password'
                }
            },
            UserExistsFailed: {
                status: 400,
                responseData: {
                    message: 'Username unavailable'
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
                    message: 'The password entered has recently been used. Please enter a new password'
                }
            },
            UserSQValidationFailed: {
                status: 400,
                responseData: {
                    message: 'Incorrect answer to security question'
                }
            },
            InCorrectRetryError: {
                status: 400,
                responseData: {
                    message: 'Due to multiple incorrect login attempts, your account is now locked.'
                },
                nextStep: config.nextStepTo.goToLogin
            },
            AccessTypeFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Incorrect access type'
                }
            },
            AccessTypeExistsFailed: {
                status: 400,
                responseData: {
                    message: 'Access type already exists'
                }
            },
            UserLoginFailed: {
                status: 400,
                responseData: {
                    message: 'Incorrect user name or password'
                }
            },
            UserLoginFailedLocked: {
                status: 400,
                responseData: {
                    message: 'User is locked. Please contact an administrator'
                }
            },
            UserLoginFailedDeleted: {
                status: 400,
                responseData: {
                    message: 'User access has been revoked. Please contact an administrator'
                }
            },
            MultipleLoginError: {
                status: 400,
                responseData: {
                    message: 'You are already logged in. Multiple logins are not allowed'
                },
                nextStep: config.nextStepTo.goToLogin
            },
            InCorrectRequestError: {
                status: 400,
                responseData: {
                    message: 'Incorrect request was provided'
                }
            },
            SessionCreationFailed: {
                status: 400,
                responseData: {
                    message: 'Incorrect request. Unable to create session'
                }
            },
            BatchCreationFailed: {
                status: 400,
                responseData: {
                    message: 'Unable to create the batch'
                }
            },
            BatchExistsFailed: {
                status: 400,
                responseData: {
                    message: 'Batch name already exists. Please change the batch name'
                }
            },
            FileUploadFailed: {
                status: 400,
                responseData: {
                    message: 'File upload rejected. Please upload the text file'
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
                    message: 'The bank policy could not be saved'
                }
            },
            BatchAuthorizeFailed: {
                status: 400,
                responseData: {
                    message: 'Unable to authorize batch'
                }
            },
            BatchEmptyAuthorizeFailed: {
                status: 400,
                responseData: {
                    message: 'Unable to authorize the empty batch'
                }
            },
            BatchDeAuthorizeFailed: {
                status: 400,
                responseData: {
                    message: 'Unable to de-authorize the batch'
                }
            },
            OperationFailed: {
                status: 400,
                responseData: {
                    message: 'Operation failed'
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
                    message: 'You have exceeded the limit per day'
                }
            },
            RecipientCreationFailed: {
                status: 400,
                responseData: {
                    message: 'Unable to create recipient'
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
                    message: 'Session has expired. Please log in again'
                }
            },
            ConfigurationFailed: {
                status: 400,
                responseData: {
                    message: 'Configuration already created'
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
                    message: 'The OTP service is not registered.  Please check available services'
                }
            },
            LimitProfileExistsFailed: {
                status: 400,
                responseData: {
                    message: 'Limit profile exists with given name'
                }
            },
            LimitProfileListFoundFailed: {
                status: 400,
                responseData: {
                    message: 'No profile exists'
                }
            },
            AccountAlreadyExist: {
                status: 400,
                responseData: {
                    message: 'Account already exists'
                }
            },
            AccountNotAllowedForTransfer: {
                status: 400,
                responseData: {
                    message: 'Account not allowed for transfer'
                }
            },
            OwnAccountNotAllowedAsRecipient: {
                status: 400,
                responseData: {
                    message: 'Own account not allowed for third party recipient'
                }
            },
            LimitProfileLinkedAccessTypeFailed : {
                status: 400,
                responseData: {
                    message: 'Limit profile is linked with an access type. It cannot be deleted'
                }
            },
            LimitProfileLinkedUserFailed : {
                status: 400,
                responseData: {
                    message: 'Limit profile is linked with users. It cannot be deleted'
                }
            },
            CreateAlert : {
                status: 400,
                responseData: {
                    message: 'Unable to set up alert'
                }
            },
            UpdateAlert : {
                status: 400,
                responseData: {
                    message: 'Unable to update alert'
                }
            },
            DeleteAlert : {
                status: 400,
                responseData: {
                    message: 'Unable to delete alert'
                }
            },
            CustomerAlreadyRegistered: {
                status: 400,
                responseData: {
                    message: 'This customer record already exists'
                }
            },
            EODExtractNotAvailable: {
                status: 400,
                responseData: {
                    message: 'EOD extract not available'
                }
            },
            StatementsNotAvailable: {
                status: 400,
                responseData: {
                    message: 'Statements not available'
                }
            },
            InvalidCaptcha: {
                status: 400,
                responseData: {
                    message: 'Invalid Captcha'
                }
            },
            NoCustomersFound: {
                status: 400,
                responseData: {
                    message: 'No customers found'
                }
            },

            NoRecordsFound: {
                status: 400,
                responseData: {
                    message: 'No records found'
                }
            },
            thirdPartyDeletionFailed: {
                status: 400,
                responseData: {
                    message: 'Selected Third Party(s) have pending transfer instruction(s), cannot be deleted.'
                }
            },
            UnauthorizedAccess: {
                status: 401,
                responseData: {
                    message: 'Unauthorized access'
                }
            },
            genericMessage: {
                status: 400,
                responseData: {
                    message: 'Unable to process. Please contact Bank.'
                }
            },
            TempPasswordExpired: {
                status: 400,
                responseData: {
                    message: 'Temporary password expired. Please contact Bank.'
                }
            },
            TempUserIdExpired: {
                status: 400,
                responseData: {
                    message: 'Temporary user id expired. Please contact Bank.'
                }
            },
            NoActiveUsers: {
                status: 400,
                responseData: {
                    message: 'No active users.'
                }
            },
            TransferAlreadyExistForGreaterAmount: {
                status: 400,
                responseData: {
                    message: 'Transfer Already Exist for Greater Amount.'
                }
            }
        }
    };
})();