(function () {

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var limitProfile = function (config, tnxId) {
        this.config = config;
        this.tnxId = tnxId;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.LimitProfile;
        this.userModel = mongoModelName.modelName.User;
        this.accessTypeModel = mongoModelName.modelName.AccessType;
    };

    limitProfile.prototype = {
        addNewProfile: function (reqBody, callback) {
            this.callback = callback;
            this.req = reqBody;

            this.routed = {
                institutionId: this.config.instId,
                name: this.req.name
            };

            var mongo = this.utils.initMongo(this.model, this.routed, this.tnxId);
            var resHandle = this.checkProfileExists.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        checkProfileExists: function (err, result) {
            if (result) {
                result.transferLimitPerTransaction = this.req.transferLimitPerTransaction;
                result.transferLimitPerDay = this.req.transferLimitPerDay;
                result.wireTransferLimitPerTransaction = this.req.wireTransferLimitPerTransaction;
                //result.wireTransferLimitPerDay = this.req.wireTransferLimitPerDay;
                result.ACHDebitLimitPerTransaction = this.req.ACHDebitLimitPerTransaction;
                //result.ACHDebitLimitPerDay = this.req.ACHDebitLimitPerDay;
                result.ACHCreditLimitPerTransaction = this.req.ACHCreditLimitPerTransaction;
                //result.ACHCreditLimitPerDay = this.req.ACHCreditLimitPerDay;
                var resHandle = this.newProfileCreated.bind(this);
                result.save(resHandle)
            } else {
                this.routed = {
                    institutionId: this.config.instId,
                    name: this.req.name,
                    transferLimitPerTransaction: this.req.transferLimitPerTransaction,
                    transferLimitPerDay: this.req.transferLimitPerDay,
                    wireTransferLimitPerTransaction: this.req.wireTransferLimitPerTransaction,
                    //wireTransferLimitPerDay: this.req.wireTransferLimitPerDay,
                    ACHDebitLimitPerTransaction: this.req.ACHDebitLimitPerTransaction,
                    //ACHDebitLimitPerDay: this.req.ACHDebitLimitPerDay,
                    ACHCreditLimitPerTransaction: this.req.ACHCreditLimitPerTransaction,
                    //ACHCreditLimitPerDay: this.req.ACHCreditLimitPerDay,
                    createdBy: this.req.user
                };
                var mongo = this.utils.initMongo(this.model, this.routed, this.tnxId);
                var resHandle = this.newProfileCreated.bind(this);
                mongo.Save(resHandle);
            }
        },
        newProfileCreated: function (err, result) {

            if (err) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.callback(null, {message: this.successResponse.CreateLimitProfile,response:result});
            }
        },
        listLimitProfiles: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.allLimitProfilesReturn.bind(this);
            mongo.FindMethod(resHandle);
        },
        allLimitProfilesReturn: function (err, result) {
            if (err) {
                var error = this.errorResponse.LimitProfileListFoundFailed;
                this.callback(error, null);
            } else {
                this.callback(null, result);
            }
        },
        deleteProfile: function (reqBody, callback) {
            this.callback = callback;
            this.req = reqBody;

            var routed = {
                institutionId: this.config.instId,
                limitProfile: this.req.id
            };

            var mongo = this.utils.initMongo(this.accessTypeModel, routed, this.tnxId);
            var resHandle = this.findLinkedAccessType.bind(this);
            mongo.Count(resHandle);
        },
        findLinkedAccessType: function (err, result) {
            if(result > 0){
                var error = this.errorResponse.LimitProfileLinkedAccessTypeFailed;
                this.callback(error, null);
            } else {
                var routed = {
                    institutionId: this.config.instId,
                    limitProfile: this.req.id
                };

                var mongo = this.utils.initMongo(this.userModel, routed, this.tnxId);
                var resHandle = this.findLinkedUsers.bind(this);
                mongo.Count(resHandle);
            }
        },
        findLinkedUsers: function (err, result) {
            if(result > 0){
                var error = this.errorResponse.LimitProfileLinkedUserFailed;
                this.callback(error, null);
            } else {
                var routed = {
                    institutionId: this.config.instId,
                    _id: this.req.id
                };

                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var resHandle = this.doDelete.bind(this);
                mongo.FindOneMethod(resHandle);
            }
        },
        doDelete: function (err, result) {
            if (err) {
                var error = this.errorResponse.LimitProfileListFoundFailed;
                this.callback(error, null);
            } else {
                var resHandle = this.doDeleteDone.bind(this);
                result.remove(resHandle);
            }
        },
        doDeleteDone: function (err, result) {
            if (err) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.callback(null , {message: this.successResponse.DeleteLimitProfile});
            }
        },
        editProfile: function (reqBody, callback) {
            this.callback = callback;
            this.req = reqBody;

            var routed = {
                institutionId: this.config.instId,
                _id: this.req.id
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.doEdit.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        doEdit: function (err, result) {
            if (err) {
                var error = this.errorResponse.LimitProfileListFoundFailed;
                this.callback(error, null);
            } else {
                result.name = this.req.name;
                result.transferLimitPerTransaction = this.req.transferLimitPerTransaction;
                result.transferLimitPerDay = this.req.transferLimitPerDay;
                result.wireTransferLimitPerTransaction = this.req.wireTransferLimitPerTransaction;
                //result.wireTransferLimitPerDay = this.req.wireTransferLimitPerDay;
                result.ACHDebitLimitPerTransaction = this.req.ACHDebitLimitPerTransaction;
                //result.ACHDebitLimitPerDay = this.req.ACHDebitLimitPerDay;
                result.ACHCreditLimitPerTransaction = this.req.ACHCreditLimitPerTransaction;
                //result.ACHCreditLimitPerDay = this.req.ACHCreditLimitPerDay;
                result.lastModifiedBy = this.req.user;
                result.save();
                this.callback(null , {message: this.successResponse.UpdateLimitProfile});
            }
        },
        overrideLimitProfileForUser: function (reqBody, callback) {
            this.callback2 = callback;
            this.reqBody = reqBody;
            this.reqBody.isLimitProfileOverridden = true;
            if(this.reqBody.limitProfileType=='customized') {
                var req = {
                    name: this.reqBody.customerId +"-Limits",
                    transferLimitPerTransaction: reqBody.transferLimitPerTransaction,
                    transferLimitPerDay: reqBody.transferLimitPerDay,
                    wireTransferLimitPerTransaction: reqBody.wireTransferLimitPerTransaction,
                    ACHDebitLimitPerTransaction: reqBody.ACHDebitLimitPerTransaction,
                    ACHCreditLimitPerTransaction: reqBody.ACHCreditLimitPerTransaction,
                    user: "System"
                }
                var resHandle = this.tempLimitProfileAdded.bind(this);
                this.addNewProfile(req,resHandle)
            }else{
                if(this.reqBody.limitProfile == "default"){
                    this.reqBody.limitProfile = null;
                    this.reqBody.isLimitProfileOverridden = false;
                }
                var routed = {
                    institutionId: this.config.instId,
                    userName:this.reqBody.userName
                };

                var mongo = this.utils.initMongo(this.userModel, routed, this.tnxId);
                var resHandle = this.getUserForOverride.bind(this);
                mongo.FindOneMethod(resHandle);
            }

        },
        tempLimitProfileAdded: function (err, result) {
            if(err){
                this.callback2(err,null)
            } else{

                var id = result.response["_id"]
                this.reqBody.limitProfile = id;
                this.reqBody.isLimitProfileOverridden = true;
                var routed = {
                    institutionId: this.config.instId,
                    userName:this.reqBody.userName
                };

                var mongo = this.utils.initMongo(this.userModel, routed, this.tnxId);
                var resHandle = this.getUserForOverride.bind(this);
                mongo.FindOneMethod(resHandle);
            }
        },
        getUserForOverride: function (err, result) {
            if (err) {
                var error = this.errorResponse.LimitProfileUpdateFailed;
                this.callback2(error, null);
            } else {
                result.limitProfile = this.reqBody.limitProfile;
                result.isLimitProfileOverridden = this.reqBody.isLimitProfileOverridden;
                result.save();
                this.callback2(null , {message: this.successResponse.UpdateLimitProfile});
            }
        },
        listLimitProfileUsers: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;

            var routed = {
                institutionId: this.config.instId,
                status : {$ne :"Deleted"},
                $or : [ {originator : 'Branch'}, {createdBy : 'admin'}, {$and: [ {createdBy : 'System'}, {$or: [ {originator:'System'}, {originator:'File'} ] } ] } ]
            };
            var options = {
                skip: this.reqBody.start,
                limit: this.reqBody.length,
                sortFirst: {}
            };
            this.searchRouted = routed;
            var fields = 'userId userName limitProfile customerName customerId customerType accessType';
            this.searchRouted = routed;
            var mongo = this.utils.initMongo(this.userModel, routed, this.tnxId, {"_id": 0}, options);
            var resHandle = this.allUsersReturn.bind(this);
            mongo.FindWithOptionsMethod(resHandle);
        },
        allUsersReturn: function (err, result) {
            if (err) {
                var error = this.errorResponse.LimitProfileListFoundFailed;
                this.callback(error, null);
            } else {
                this.usersList = result;

                var mongo = this.utils.initMongo(this.userModel, this.searchRouted, this.tnxId);
                var resHandle = this.allUsersReturnNext.bind(this);
                mongo.Count(resHandle);
            }
        },
        allUsersReturnNext: function (err, result) {
            if (err) {
                var error = this.errorResponse.LimitProfileListFoundFailed;
                this.callback(error, null);
            } else {
                var routed = {
                    institutionId: this.config.instId
                };
                this.recordsTotal = result;
                var mongo = this.utils.initMongo(this.accessTypeModel, routed, this.tnxId);
                var resHandle = this.allUsersReturnNext2.bind(this);
                mongo.FindMethod(resHandle);
            }
        },
        allUsersReturnNext2: function (err, result) {
            if (err) {
                var error = this.errorResponse.LimitProfileListFoundFailed;
                this.callback(error, null);
            } else {
                for(var i = 0; i < this.usersList.length ; i++){
                    if(this.usersList[i].limitProfile == undefined || this.usersList[i].limitProfile == null || this.usersList[i].limitProfile == ""){
                        for(var j = 0 ; j < result.length ; j++ ) {
                            if(this.usersList[i].accessType == result[j].accessType) {
                                this.usersList[i].limitProfile = result[j].limitProfile;
                                this.usersList[i].isLimitProfileOverridden = false;
                                break;
                            }
                        }
                    }
                }
                var finalResponse = {
                    recordsTotal: this.recordsTotal,
                    data: this.usersList
                }
                this.callback(null, finalResponse);
            }
        }
    };

    module.exports = function (config, tnxId) {
        return (new limitProfile(config, tnxId));
    };
})();