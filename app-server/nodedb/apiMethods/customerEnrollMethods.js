(function(){

    var genPass = require('password.js');
    genPass.charsLowerCase = 'abcdefghjkmnpqrstuvwxyz';
    genPass.charsUpperCase = 'ABCDEFGHJKMNPQRSTUVWXYZ';

    var bankPolicyMethod = require('../supportMethods/bankPolicyMethods');

    var utils = require('../lib/utils/utils');

    var userMethod = require('./userMethods');

    var customerEnrollCore = require('../server/coreMethods/customerEnrollmentCore');

    var errorResponse = require('../gen/errorResponse');

    function CustomerEnroll(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
    }

    CustomerEnroll.prototype = {
        scheduleEnroll: function(){
            var bank = bankPolicyMethod(this.config , this.tnxId);
            var resHandle = this.bankPolicyData.bind(this);
            bank.getBankPolicy({} , resHandle);
        },
        bankPolicyData: function(err , result){
            if(!result) result = {};

            this.bankPolicy = result;
            var enroll = customerEnrollCore.CustomerEnroll(this.config , this.tnxId);
            var resHandle = this.coreCustomerEnroll.bind(this);
            enroll.coreCaller(resHandle);
        },
        coreCustomerEnroll: function(err , result){
            if(err){
                this.utils.log(this.tnxId , err , 'console.log');
                //console.log(err);
            }else{
                var customerData = result.customerData || [];
                for(var i = 0; i < customerData.length; i++){
                    var userName = this.createUserName(this.bankPolicy);
                    var password = this.createPassword(this.bankPolicy);
                    var reqBody = {
                        customerId                          : customerData[i].customerId,
                        customerName                        : customerData[i].fullName,
                        userName                            : userName,
                        emailId                             : customerData[i].emailAddress,
                        password                            : password,
                        status                              : "Not Enrolled",
                        mobileNo                            : customerData[i].cellPhoneNumberData.phoneNumber,
                        customerType                        : customerData[i].customerType,
                        accessType                          : customerData[i].accessType,
                        customerAccounts                    : customerData[i].customerAccounts,
                        bankPolicy                          : this.bankPolicy,
                        createdBy                           : "System",
                        originator                          : "System",
                        firstLogin                          : true
                    };

                    var user = userMethod(this.config , this.tnxId);
                    var resHandle = this.customerAdded.bind(this);
                    user.directEnroll(reqBody , resHandle);
                }
            }
        },
        customerAdded: function(err , result){
            if(err){
                //console.log("Customer Core Addition Error: ", err);
                this.utils.log(this.tnxId , "Customer Core Addition Error: "+ JSON.stringify(err) , 'console.log');
            }else{
                this.utils.log(this.tnxId , 'Customer From Core Addition Successfull', 'console.log');
                //console.log(result);
            }
        },
        createPassword: function(bankPolicy){
            var PassLen = '6';var special = '0';var nums = '1';var uppers = '1';var lowers = '1';
            if(bankPolicy.passwordRestrictions){
                PassLen = bankPolicy.passwordRestrictions.minimumLength > PassLen ? bankPolicy.passwordRestrictions.minimumLength : PassLen ;special = bankPolicy.passwordRestrictions.minimumSpecialChars;nums = bankPolicy.passwordRestrictions.minimumNumericChars;uppers = bankPolicy.passwordRestrictions.minimumUpperCaseChars;lowers = bankPolicy.passwordRestrictions.minimumLowerCaseChars;
            }

            return genPass.generate(PassLen, { specials: special, nums: nums, uppers: uppers, lowers: lowers});
        },
        createUserName: function(bankPolicy){
            var PassLen = '6';var special = '0';var nums = '0';var uppers = '1';var lowers = '4';
            if(bankPolicy.userIdRestrictions){
                PassLen = bankPolicy.userIdRestrictions.minimumLength > PassLen ? bankPolicy.userIdRestrictions.minimumLength : PassLen ;special = bankPolicy.userIdRestrictions.minimumSpecialChars;nums = bankPolicy.userIdRestrictions.minimumNumericChars;uppers = '1';lowers = bankPolicy.userIdRestrictions.minimumAlphaChars;
            }

            return genPass.generate(PassLen, { specials: special, nums: nums, uppers: uppers, lowers: lowers});
        }

    };

    module.exports = function(config , tnxId){
        return (new CustomerEnroll(config , tnxId));
    };
})();