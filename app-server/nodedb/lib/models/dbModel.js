(function () {
    <!--##################################Require the Modules########################################################-->

    module.exports.modelForService = function(service){

        var dbConn = require('../prop/globalConnObj');

        var db = dbConn.getdbConn(service);

        var mongoose = dbConn.getConnMongoose(service),
            Schema = mongoose.Schema;

        var timestamps = require('../utils/timestamp');


        <!--##################################User Schema#####################################################-->
        <!--#########################################################################################################-->
        var User = new Schema({
            institutionId                           : {type: String , required  : true },
            userId                                  : {type: String , required  : true },
            status                                  : {type: String , required  : true },
            userName                                : {type: String , required  : true },
            password                                : {type: String },
            contact                                 : {
                mobileNo                                : {type: String , required  : true },
                emailId                                 : {type: String , required  : true }
            },
            userRole                                : {type: String },
            createdBy                               : {type: String , default : 'System' , required  : true },
            source                                  : {type: String , default : 'System' , required  : true }
        });

        User.plugin(timestamps);
        User.index({institutionId:1,userId:1},{unique:true});
        User.index({institutionId:1,userName:1},{unique:true});

        module.exports.User = db.model('user', User);

        <!--##################################UserChallengeQuestion Schema################################################-->
        <!--#########################################################################################################-->

        var UserChallengeQuestion = new Schema({
            institutionId                           : {type: String , required  : true },
            userId                                  : {type: String , required  : true },
            securityQuestion                        : [{
                questionId                              : {type: String},
                answer                                  : {type: String}
            }]
        });

        UserChallengeQuestion.plugin(timestamps);
        UserChallengeQuestion.index({institutionId:1,userId:1},{unique:true});

        module.exports.UserChallengeQuestion = db.model('userchallengequestion', UserChallengeQuestion);

        <!--##################################ChallengeQuestions Schema#####################################################-->
        <!--#########################################################################################################-->

        var ChallengeQuestions = new Schema({
            institutionId                           : {type: String , required  : true },
            question                                : {type: String , required  : true  },
            language                                : {type: String , required  : true  },
            category                                : {type: String , required  : true  },
            categoryDescription                     : {type: String , required  : true  },
            questionId                              : {type: String , required  : true  }
        });

        ChallengeQuestions.plugin(timestamps);
        ChallengeQuestions.index({institutionId:1,questionId:1,language:1},{unique:true});
        ChallengeQuestions.index({institutionId:1,questionId:1,language:1,category:1},{unique:true});

        module.exports.ChallengeQuestions = db.model('challengequestion', ChallengeQuestions);

        <!--##################################OTP Schema#####################################################-->
        <!--#########################################################################################################-->
        var Otp = new Schema({
            institutionId           : {type: String , required  : true },
            userId                  : {type: String , required  : true  },
            otp                     : {type: String , required  : true  },
            action                  : {type: String },
            sendThroughEmail        : {type: String },
            sendThroughSms          : {type: String }
        });

        Otp.plugin(timestamps);
        Otp.index({institutionId:1,userId:1,action:1},{unique:true});

        module.exports.Otp = db.model('otp', Otp);

        <!--################################## Bank Config Schema ##############################################-->
        <!--#########################################################################################################-->
        var BankConfig = new Schema({
            institutionId           : {type: String, required: true  },
            encryptionKey           : {type: String, required: true  }
        });

        BankConfig.plugin(timestamps);
        BankConfig.index( { institutionId: 1 }, { unique: true } );

        module.exports.BankConfig = db.model('bankconfig', BankConfig);

    };
})();