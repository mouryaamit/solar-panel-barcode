(function(){

    var json2csv = require('json2csv');

    var convertJSONtoCSV = function(jsonData ,fieldNames , callback){

        var fields = [];
        var csvData = "";

        for (var key in jsonData[0]){
            fields.push(key);
        }

        json2csv({data: jsonData, fields: fields , fieldNames: fieldNames}, function(err, csv) {
            if(csv) csvData = csv;
            callback(csvData);
        });
    };

    var convertJSONtoTSV = function(jsonData ,fieldNames , callback){

        var field = [];
        var tsvData = "";

        for (var key in jsonData[0]){
            field.push(key);
        }

        json2csv({data: jsonData, fields: field , fieldNames: fieldNames , del: '\t'}, function(err, tsv) {
            if(tsv)tsvData = tsv;
            callback(tsv);
        });
    };

    module.exports.csvConverter = function(jsonData ,fieldNames , callback){
        return (new convertJSONtoCSV(jsonData ,fieldNames , callback));
    };

    module.exports.tsvConverter = function(jsonData ,fieldNames , callback){
        return (new convertJSONtoTSV(jsonData , fieldNames , callback));
    };
})();