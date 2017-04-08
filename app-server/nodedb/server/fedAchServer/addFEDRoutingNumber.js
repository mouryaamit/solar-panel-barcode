(function(){

    var fs = require('fs');

    var path = require('path');

    var _ = require('underscore');

    var mongoCall = require('../../databases/queryMongo');

    var mongoModelName = require('../../lib/mongoQuery/mongoModelObj').modelName;

    var routingModel = mongoModelName.FedRoutingInfo;

    var routingListModel = mongoModelName.FedRoutingNo;

    var readFileTxt = function(){

        var mongo = new mongoCall.MongoQuery(routingModel, {}, 'fedFileUpdated');
        mongo.Remove();

        var mongoObj = new mongoCall.MongoQuery(routingListModel, {}, 'fedFileUpdated');
        mongoObj.Remove();

        var filePath = path.resolve('./nodedb/server/fedAchServer');
        fs.readFile(filePath + '/fpddir.txt', function (err, data) {
            if (err) throw err;
            var buffer = new Buffer(data);
            var fileSt = buffer.toString();
            var splitfile = fileSt.split('\n');
            done(splitfile);
        });
    };

    var done = function(file){
        var stateColl = {};
        var stateCity = [];
        var routingNo = [];
        var fileLen = file.length;

        console.log("File Being processed Length " + fileLen +". Please don't exit!!.");
        for(var i = 0 ; i < fileLen; i++){
            var routingNumber = (file[i].slice(0, 9)).trim(),
                telegraphicName = (file[i].slice(9, 27)).trim(),
                customerName = (file[i].slice(27, 63)).trim(),
                stateCode = (file[i].slice(63, 65)).trim(),
                city = (file[i].slice(65, 90)).trim(),
                fundsTransferStatus = (file[i].slice(90, 91)).trim(),
                fundsSettlementOnlyStatus = (file[i].slice(91, 92)).trim(),
                bookEntrySecuritiesTransferStatus = (file[i].slice(92, 93)).trim(),
                dateOfLastRevision = (file[i].slice(93, 100)).trim();

            if(routingNumber != ''){
                var jsonObj = {
                    routingNumber                       : routingNumber,
                    telegraphicName                     : telegraphicName,
                    bankName                            : customerName,
                    city                                : city,
                    stateCode                           : stateCode,
                    fundsTransferStatus                 : fundsTransferStatus,
                    fundsSettlementOnlyStatus           : fundsSettlementOnlyStatus,
                    bookEntrySecuritiesTransferStatus   : bookEntrySecuritiesTransferStatus,
                    dateOfLastRevision                  : dateOfLastRevision
                };

                routingNo.push(routingNumber);

                var scKey = stateCode+city;
                scKey = scKey.split(" ").join("");
                if(stateColl[scKey]){
                    stateColl[scKey]["banks"].push(jsonObj);
                }else{
                    stateCity.push(scKey);
                    stateColl[scKey] = {
                        scKey  : scKey,
                        stateCode  : stateCode,
                        city  : city,
                        banks : []
                    };
                    stateColl[scKey]["banks"].push(jsonObj);
                }
            }
        }

        stateCity = _.uniq(stateCity);
        var stateCityLen = stateCity.length;
        routingNo = _.uniq(routingNo);
        var routingNoLen = routingNo.length;

        console.log("total collections count ",routingNoLen);
        for(var j = 0 ; j < stateCityLen; j++){
            var addColl = stateColl[stateCity[j]];
            var testToDb = new importToDB();
            testToDb.saveToDB(addColl);
        }

        for(var k = 0 ; k < routingNoLen; k++){
            var routing = new importToDB();
            routing.saveOnlyRoutingNo(routingNo[k]);
        }
    };

    var importToDB = function(){
    };

    importToDB.prototype = {
        saveToDB : function(dbObj){
            this.dbObj = dbObj;
            var mongo = new mongoCall.MongoQuery(routingModel, dbObj, 'direct');
            var resHandle = this.responseHandlerForInfo.bind(this);
            mongo.Save(resHandle);
        },
        saveOnlyRoutingNo : function(routingNo){
            this.routingNo = routingNo;
            var routed = {
                routingNo : routingNo
            };
            var mongo = new mongoCall.MongoQuery(routingListModel, routed, 'direct');
            var resHandle = this.responseHandlerForNo.bind(this);
            mongo.Save(resHandle);
        },
        responseHandlerForNo : function (err,result) {
            if(!result){
                console.log("FED Routing No : " + this.routingNo + " Already Exist.")
            } else {
                console.log("FED Routing No : " + this.routingNo + " Saved.")
            }
        },
        responseHandlerForInfo : function (err,result) {
            if(!result){
                console.log("FED Routing Info For : " + this.dbObj.scKey + " Already Exist.")
            } else {
                console.log("FED Routing Info For : " + this.dbObj.scKey + " Saved.")
            }
        }
    };

    module.exports = function(){
        return (new readFileTxt());
    };
})();