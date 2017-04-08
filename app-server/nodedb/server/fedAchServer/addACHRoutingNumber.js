(function(){

    var fs = require('fs');

    var path = require('path');

    var _ = require('underscore');

    var mongoCall = require('../../databases/queryMongo');

    var mongoModelName = require('../../lib/mongoQuery/mongoModelObj').modelName;

    var routingModel = mongoModelName.ACHRoutingInfo;

    var routingListModel = mongoModelName.ACHRoutingNo;

    var readFileTxt = function(){

        var mongo = new mongoCall.MongoQuery(routingModel, {}, 'fedFileUpdated');
        mongo.Remove();

        var mongoObj = new mongoCall.MongoQuery(routingListModel, {}, 'fedFileUpdated');
        mongoObj.Remove();

        var filePath = path.resolve('./nodedb/server/fedAchServer');
        fs.readFile(filePath + '/FedACHdir.txt', function (err, data) {
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
                officeCode = (file[i].slice(9, 10)).trim(),
                servicingFRBNumber = (file[i].slice(10, 19)).trim(),
                recordTypeCode = (file[i].slice(19, 20)).trim(),
                changeDate = (file[i].slice(20, 26)).trim(),
                newRoutingNumber = (file[i].slice(26, 35)).trim(),
                customerName = (file[i].slice(35, 71)).trim(),
                address = (file[i].slice(71, 107)).trim(),
                city = (file[i].slice(107, 127)).trim(),
                stateCode = (file[i].slice(127, 129)).trim(),
                zipcode = (file[i].slice(129, 134)).trim(),
                zipcodeExtension = (file[i].slice(134, 138)).trim(),
                telephoneAreaCode = (file[i].slice(138, 141)).trim(),
                telephonePrefixNumber = (file[i].slice(141, 144)).trim(),
                telephoneSuffixNumber = (file[i].slice(144, 148)).trim(),
                institutionStatusCode = (file[i].slice(148, 149)).trim(),
                dataViewCode = (file[i].slice(149, 150)).trim();

            /*if(recordTypeCode == '2'){
                routingNumber = newRoutingNumber;
            }*/

            if(routingNumber != '' && recordTypeCode == 1){
                var jsonObj = {
                    routingNumber           : routingNumber,
                    officeCode              : officeCode,
                    servicingFRBNumber      : servicingFRBNumber,
                    recordTypeCode          : recordTypeCode,
                    changeDate              : changeDate,
                    newRoutingNumber        : newRoutingNumber,
                    bankName                : customerName,
                    address                 : address,
                    city                    : city,
                    stateCode               : stateCode,
                    zipcode                 : zipcode,
                    zipcodeExtension        : zipcodeExtension,
                    telephoneAreaCode       : telephoneAreaCode,
                    telephonePrefixNumber   : telephonePrefixNumber,
                    telephoneSuffixNumber   : telephoneSuffixNumber,
                    institutionStatusCode   : institutionStatusCode,
                    dataViewCode            : dataViewCode
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
                console.log("ACH Routing No : " + this.routingNo + " Already Exist.")
            } else {
                console.log("ACH Routing No : " + this.routingNo + " Saved.")
            }
        },
        responseHandlerForInfo : function (err,result) {
            if(!result){
                console.log("ACH Routing Info For : " + this.dbObj.scKey + " Already Exist.")
            } else {
                console.log("ACH Routing Info For : " + this.dbObj.scKey + " Saved.")
            }
        }
    };

    module.exports = function(){
        return (new readFileTxt());
    };
})();