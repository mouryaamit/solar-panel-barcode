(function(){

    var _ = require('underscore');

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var userPageHitModel = require('../lib/models/dbModel').UserPageHit;

    var totalPageHitModel = require('../lib/models/dbModel').TotalPageHit;

    var PageHit = function(config , tnxId){
        this.config = config;
        this.tnxId = tnxId;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
    };

    PageHit.prototype = {
        findTotalOverview: function(reqBody , callback){
            this.callback = callback;
            var routed = { institutionId : this.config.instId, $and: [ { currentDate : { $gte : new Date(reqBody.fromDate) } } , { currentDate : {$lte : new Date(reqBody.toDate) } } ] };
            var resHandle = this.createOverviewPageCol.bind(this);
            totalPageHitModel.find(routed , resHandle);
        },
        createOverviewPageCol: function(err , result){
            if(result.length < 0){
                this.callback(null , []);
            }else{
                var pageList = [];
                var pageObj = {};

                for(var i = 0; i < result.length; i++){
                    var pageName = result[i].pageName;
                    pageList.push(pageName);
                    if(pageObj[pageName]){
                        pageObj[pageName]["visitCounter"] =  pageObj[pageName]["visitCounter"] + result[i].visitCounter;
                        pageObj[pageName]["userUniqueId"] = _.union(pageObj[pageName]["userUniqueId"] , result[i].userUniqueId);
                    }else{
                        pageObj[pageName] = result[i];
                    }
                }
                pageList = _.uniq(pageList);
                this.createOverviewColl(pageList , pageObj);
            }
        },
        createOverviewColl: function(uniquePage , collection){
            var responseColl = [];
            var totalPageLen = uniquePage.length;
            for(var j = 0 ; j < totalPageLen; j++){
                var addColl = {
                    _id: collection[uniquePage[j]].pageName,
                    pageName: collection[uniquePage[j]].pageName,
                    section: collection[uniquePage[j]].section,
                    visitCounter: collection[uniquePage[j]].visitCounter,
                    userCounter: (collection[uniquePage[j]].userUniqueId).length
                };
                responseColl.push(addColl);
            }
            this.callback(null ,responseColl);
        },
        findTotalOldOverview: function(reqBody , callback){
            var that = this;
            totalPageHitModel.aggregate(
                {$match: {institutionId : this.config.instId, $and: [ { currentDate : { $gte : new Date(reqBody.fromDate) } } , { currentDate : {$lte : new Date(reqBody.toDate) } } ] }},
                { $group: {
                    _id: '$pageName',
                    pageName: { $first: '$pageName' },
                    section : { $first: '$section' },
                    visitCounter : { $sum: "$visitCounter" },
                    userCounter : { $sum: "$userCounter" }
                }}
                , function (err, result) {
                    if(err){
                        var error = that.errorResponse.OperationFailed;
                        callback(error ,null);
                    } else {
                        callback(null ,result);
                    }
                });
        },
        findUserTotalOverview: function(reqBody , callback){
            var that = this;
            userPageHitModel.aggregate(
                {$match: { institutionId : this.config.instId, pageName:reqBody.pageName , $and: [ { currentDate : { $gte : new Date(reqBody.fromDate) } } , { currentDate : {$lte : new Date(reqBody.toDate) } } ] }},
                { $group: {
                    _id: '$customerName',
                    customerName: { $first: '$customerName' },
                    userId : { $first: '$userId' },
                    userName : { $first: '$userName' },
                    noOfHits : { $sum: "$visitCounter" }
                }}
                , function (err, result) {
                    if(err){
                        var error = that.errorResponse.OperationFailed;
                        callback(error ,null);
                    } else {
                        callback(null ,result);
                    }
                });
        },
        findUserReport: function(reqBody , callback){
            var that = this;
            userPageHitModel.aggregate(
                {$match: { institutionId : this.config.instId, userId: reqBody.userId, $and: [ { currentDate : { $gte : new Date(reqBody.fromDate) } } , { currentDate : {$lte : new Date(reqBody.toDate) } } ] }},
                { $group: {
                    _id: '$pageName',
                    pageName: { $first: '$pageName' },
                    userId : { $first: '$userId' },
                    userName : { $first: '$userName' },
                    section : { $first: '$section' },
                    noOfHits : { $sum: "$visitCounter" }
                }}
                , function (err, result) {
                    if(err){
                        var error = that.errorResponse.OperationFailed;
                        callback(error ,null);
                    } else {
                        callback(null ,result);
                    }
                });
        },
        addPageHitReport: function(rBody , callback){
            var reqBody = rBody;
            var that = this;
            var dated = new Date();
            var datedFilter = (dated.getMonth() + 1) + "/" + dated.getDate() + "/" + dated.getFullYear().toString().substr(2,2);
            var pageHitObj = {
                institutionId           : this.config.instId,
                currentDate             : new Date(datedFilter),
                userId                  : reqBody.userId,
                userName                : reqBody.userSelectedName,
                customerName            : reqBody.customersName,
                section                 : reqBody.section,
                pageName                : reqBody.pageName,
                visitCounter            : 1
            };

            var totalPageHitObj = {
                institutionId           : this.config.instId,
                currentDate             : new Date(datedFilter),
                section                 : reqBody.section,
                pageName                : reqBody.pageName,
                visitCounter            : 1,
                userCounter             : 1,
                userUniqueId            : [pageHitObj.userId]
            };


            var TotalPageHits = function(err , result){
                if(!result){
                    var totalPHObj = new totalPageHitModel(totalPageHitObj);
                    totalPHObj.save(function (err, doc) {
                        that.utils.log(that.tnxId , 'totalPageHitSaved' , 'afterSave');
                    });
                }else{
                    result.visitCounter = result.visitCounter + 1;
                    result.userCounter = result.userCounter + totalPageHitObj.userCounter;
                    if(totalPageHitObj.userCounter > 0) result.userUniqueId.push(pageHitObj.userId);
                    result.save();
                }
            };

            var UserPageHit = function(err  , result){
                if(!result){
                    var userPHObj = new userPageHitModel(pageHitObj);
                    userPHObj.save(function (err, doc) {
                        that.utils.log(that.tnxId , 'userPageHitSaved' , 'afterSave');
                    });
                }else{
                    totalPageHitObj.userCounter = 0;
                    result.visitCounter = result.visitCounter + 1;
                    result.save();
                }

                var routedTPH = { institutionId : that.config.instId, currentDate: new Date(datedFilter) , pageName: reqBody.pageName};
                totalPageHitModel.findOne(routedTPH , TotalPageHits);
            };

            var routedUPH = { institutionId : this.config.instId, currentDate: new Date(datedFilter) , userId: pageHitObj.userId, pageName: reqBody.pageName};
            userPageHitModel.findOne(routedUPH , UserPageHit);
            callback(null , {message: 'PageHit Reported'});
        }
    };

    module.exports = function(config , tnxId){
        return (new PageHit(config , tnxId));
    };
})();