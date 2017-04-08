(function () {

    var bankPolicyMethod = require('./bankPolicyMethods');

    var bankPasswordRuleMethod = require('./bankPasswordRuleMethods');

    var errorResponse = require('../gen/errorResponse');

    function PolicyRestriction(config, tnxId) {
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
    }

    PolicyRestriction.prototype = {
        checkUserId: function (userId, callback) {
            this.callback = callback;
            this.userId = userId;
            this.resHandler = this.processForUserId.bind(this);

            var bankPolicy = bankPolicyMethod(this.config, this.tnxId);
            var resHandle = this.policyListed.bind(this);
            bankPolicy.getBankPolicy(null, resHandle);
        },
        policyListed: function (err, result) {
            if (!result) {
                this.callback(true, null);
            } else {
                this.policyData = result;
                this.resHandler();
            }
        },
        processForUserId: function () {

            var charLength = this.userId.length >= parseInt(this.policyData.userIdRestrictions.minimumLength);
            var numericChars = this.checkNumericChars(this.userId, this.policyData.userIdRestrictions.minimumNumericChars);
            var specialChars = this.checkSpecialChars(this.userId, this.policyData.userIdRestrictions.minimumSpecialChars);
            var alphaChars = this.checkAlphaChars(this.userId, this.policyData.userIdRestrictions.minimumAlphaChars);

            if (charLength && numericChars && specialChars && alphaChars) {
                this.callback(null, this.policyData);
            } else {
                this.callback(true, null);
            }
        },
        checkPassword: function (userObj, callback) {
            console.log("userObj")
            console.log(userObj)
            console.log("userObj")
            this.callback = callback;
            this.userId = userObj.userId;
            this.password = userObj.password;
            this.customerName = userObj.customerName;

            //this.callback(null , true);
            this.resHandler = this.processForPassword.bind(this);

            var bankPolicy = bankPolicyMethod(this.config, this.tnxId);
            var resHandle = this.policyListed.bind(this);
            bankPolicy.getBankPolicy(null, resHandle);
        },
        processForPassword: function () {
            var charLength = this.password.length >= parseInt(this.policyData.passwordRestrictions.minimumLength);
            var numericChars = this.checkNumericChars(this.password, this.policyData.passwordRestrictions.minimumNumericChars);
            var specialChars = this.checkSpecialChars(this.password, this.policyData.passwordRestrictions.minimumSpecialChars);
            var upperChars = this.checkUpperChars(this.password, this.policyData.passwordRestrictions.minimumUpperCaseChars);
            var lowerChars = this.checkLowerChars(this.password, this.policyData.passwordRestrictions.minimumLowerCaseChars);

            var userIdInPassword = this.checkUserInPassword(this.password, this.userId);
            var nameInPassword = this.checkUserNamePassword(this.password, this.customerName);
            var keywordRestrictions = this.checkRestrictedKeywords(this.password, this.userId);
            console.log("charLength : "+charLength)
            console.log("numericChars : "+numericChars)
            console.log("specialChars : "+specialChars)
            console.log("upperChars : "+upperChars)
            console.log("lowerChars : "+lowerChars)
            console.log("userIdInPassword : "+userIdInPassword)
            console.log("nameInPassword : "+nameInPassword)
            console.log("keywordRestrictions : "+keywordRestrictions)
            // && keywordRestrictions
            if (charLength && numericChars && specialChars && upperChars && lowerChars && userIdInPassword && nameInPassword && keywordRestrictions) {
                this.callback(null, this.policyData);
            } else {
                this.callback(true, null);
            }
        },
        checkAdminPassword: function (userObj, callback) {
            this.callback = callback;
            this.userId = userObj.userId;
            this.password = userObj.password;
            this.customerName = userObj.customerName;

            //this.callback(null , true);
            this.resHandler = this.processAdminPassword.bind(this);

            var adminPolicy = bankPasswordRuleMethod(this.config, this.tnxId);
            var resHandle = this.policyListed.bind(this);
            adminPolicy.getBankPasswordRule(null, resHandle);
        },
        processAdminPassword: function () {

            var charLength = this.password.length >= parseInt(this.policyData.minimumLength);
            var numericChars = this.checkNumericChars(this.password, this.policyData.minimumNumericChars);
            var specialChars = this.checkSpecialChars(this.password, this.policyData.minimumSpecialChars);
            var upperChars = this.checkUpperChars(this.password, this.policyData.minimumUpperCaseChars);
            var lowerChars = this.checkLowerChars(this.password, this.policyData.minimumLowerCaseChars);

            var userIdInPassword = this.checkUserInPassword(this.password, this.userId);
            var nameInPassword = this.checkUserNamePassword(this.password, this.customerName);
            var keywordRestrictions = this.checkRestrictedKeywords(this.password, this.userId);
            console.log(charLength, numericChars, specialChars, upperChars, lowerChars, userIdInPassword, nameInPassword, keywordRestrictions);
            // && keywordRestrictions
            if (charLength && numericChars && specialChars && upperChars && lowerChars && userIdInPassword && nameInPassword && keywordRestrictions) {
                this.callback(null, this.policyData);
            } else {
                this.callback(true, null);
            }
        },
        checkNumericChars: function (input, restriction) {
            if (restriction == null || restriction == undefined || restriction == 0) {
                return true;
            }
            var numericChars = input.match(/[0-9]/g)
            if (numericChars != null) {
                return (restriction <= numericChars.length)
            } else {
                return false;
            }
            //var numericChars = new RegExp('[0-9]{'+ restriction +'}');
            //var checkForNumericChars = input.match(numericChars);
            //return (checkForNumericChars != null);
        },
        checkSpecialChars: function (input, restriction) {
            if (restriction == null || restriction == undefined || restriction == 0) {
                return true;
            }
            var specialChars = input.match(/[\W_]/g);
            if (specialChars != null) {
                return (restriction <= specialChars.length)
            } else {
                return false;
            }
            //var specialChars = new RegExp('[~!&.%$()@#*_=-]{'+ restriction +'}');
            //var checkForSpecialChars = input.match(specialChars);
            //return (checkForSpecialChars != null);
        },
        checkAlphaChars: function (input, restriction) {
            if (restriction == null || restriction == undefined || restriction == 0) {
                return true;
            }
            var alphaChars = input.match(/[a-zA-Z]/g)
            if (alphaChars != null) {
                return (restriction <= alphaChars.length)
            } else {
                return false;
            }
            //var alphaChars = new RegExp('([a-zA-Z]){'+ restriction +'}');
            //var checkForAlphaChars = input.match(alphaChars);
            //return (checkForAlphaChars != null);
        },
        checkUpperChars: function (input, restriction) {
            if (restriction == null || restriction == undefined || restriction == 0) {
                return true;
            }
            var upperChars = input.match(/[A-Z]/g)
            if (upperChars != null) {
                return (restriction <= upperChars.length)
            } else {
                return false;
            }
            //var upperChars = new RegExp('[A-Z]{'+ restriction +'}');
            //var checkForUpperChars = input.match(upperChars);
            //return (checkForUpperChars != null);
        },
        checkLowerChars: function (input, restriction) {
            if (restriction == null || restriction == undefined || restriction == 0) {
                return true;
            }
            var lowerChars = input.match(/[a-z]/g)
            if (lowerChars != null) {
                return (restriction <= lowerChars.length)
            } else {
                return false;
            }
            //var lowerChars = new RegExp('[a-z]{'+ restriction +'}');
            //var checkForLowerChars = input.match(lowerChars);
            //return (checkForLowerChars != null);
        },
        checkUserInPassword: function (input, restriction) {
            if (this.policyData.restrictUserIdInPassword) {
                var userIdChars = new RegExp(restriction, "i");
                var checkForUserIdChars = input.match(userIdChars);
                return (checkForUserIdChars == null);
            }

            return true;
        },
        checkUserNamePassword: function (input, restriction) {
            console.log("input "+input)
            console.log("restriction "+restriction)
            if (this.policyData.restrictNameInPassword) {
                var userNameChars = new RegExp(restriction, "i");
                console.log("userNameChars "+userNameChars)
                var checkForUserNameChars = input.match(userNameChars);
                console.log("checkForUserNameChars "+checkForUserNameChars)
                console.log(checkForUserNameChars == null)
                return (checkForUserNameChars == null);
            }

            return true;
        },
        checkRestrictedKeywords: function (input, restriction) {
            if (this.policyData.restrictPasswordKeywords) {
                //var contains = _.contains(this.policyData.passwordKeywords , input);
                var keyWord = this.policyData.passwordKeywords;
                for (var i = 0; i < keyWord.length; i++) {
                    var word = keyWord[i];
                    var regExp = new RegExp(word, "i");
                    if (input.search(regExp) >= 0) {
                        return false;
                    }
                }
            }
            return true;
        }
    };

    module.exports = function (config, tnxId) {
        return (new PolicyRestriction(config, tnxId));
    };
})();