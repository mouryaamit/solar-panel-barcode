(function(){

    var _ = require('underscore');

    var UserModel = require('../models/dbModel').User;
    var ChallengeQuestionsModel = require('../models/dbModel').ChallengeQuestions;
    var UserChallengeQuestionModel = require('../models/dbModel').UserChallengeQuestion;
    var OtpModel = require('../models/dbModel').Otp;
    var BankConfigModel = require('../models/dbModel').BankConfig;

    exports.modelName = {

        User                                    : 'User',
        ChallengeQuestions                      : 'ChallengeQuestions',
        UserChallengeQuestion                   : 'UserChallengeQuestion',
        Otp                                     : 'Otp',
        BankConfig  :'BankConfig'

    };

    var mongoModels = [
        {
            model               : 'User',
            modelObj            : UserModel
        },
        {
            model               : 'ChallengeQuestions',
            modelObj            : ChallengeQuestionsModel
        },
        {
            model               : 'UserChallengeQuestion',
            modelObj            : UserChallengeQuestionModel
        },
        {
            model               : 'Otp',
            modelObj            : OtpModel
        },
        {
            model               : 'BankConfig',
            modelObj            : BankConfigModel
        }
    ];


    exports.getModelByModelName = function(collName){

        return(_.findWhere(mongoModels, {model: collName}));
    };
})();