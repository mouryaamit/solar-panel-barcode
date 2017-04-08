(function(){

    var _ = require('underscore');

    var moment = require('moment');

    var downloader = require('./fileDownloadMethods');

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    function InValidLogin(config , tnxId){
        var dated = new Date();
        this.dated = (dated.getMonth() + 1) + "/" + dated.getDate() + "/" + dated.getFullYear().toString().substr(2,2);
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.InValidLogin;
    }

    InValidLogin.prototype = {
        addInvalidLogin: function(loginInfo){

            var routed = {
                institutionId                           : this.config.instId,
                recordDate                              : new Date(this.dated),
                customerType                            : loginInfo.userType,
                userId                                  : loginInfo.userId,
                isValidUserId                           : loginInfo.validUser,
                ipAddress                               : loginInfo.ipAddress
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.Save();
        },
        listInValidLogin: function(reqBody , callback){
            this.callback = callback;
            this.userId =reqBody.userId;
            (reqBody.download == 'csv' || reqBody.download == 'tsv' || reqBody.download == 'pdf')? this.downloadFile = true : this.downloadFile = false;

            this.downloadMethod = downloader(this.config , reqBody.download , 'InValidLogin' ,reqBody.userId, this.tnxId);

            var routed = { institutionId : this.config.instId, customerType : reqBody.customerType, $and: [ { recordDate: { $gte: new Date(reqBody.searchFrom) } }, { recordDate: { $lte: new Date(reqBody.searchTo) } } ] };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.returnInValidReport.bind(this);
            mongo.FindMethod(resHandle);
        },
        returnInValidReport: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                if(this.downloadFile){
                    var jsonArray = [];
                    var headers = ['Date' , 'Time' , 'User ID' , 'IP Address' , 'Valid User ID'];
                    for(var i = 0 ; i < result.length; i++){
                        var jsonObj = {
                            dated           : moment(result[i].createdOn).format('L'),
                            time            : moment.utc(result[i].createdOn).format('h:mm:ss a') + " GMT",
                            userId          : result[i].userId,
                            ipAddress       : result[i].ipAddress,
                            isValidUserId   : result[i].isValidUserId
                        };

                        jsonArray.push(jsonObj);
                    }

                    jsonArray = _.sortBy(jsonArray, 'dated');
                    this.downloadMethod.parseData(jsonArray , headers , this.callback , 'invalidReport', null,this.userId);
                }else{
                    this.callback(null , result);
                }
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new InValidLogin(config , tnxId));
    };
})();