/**
 * Created by amitmourya on 05/04/17.
 */
var tsv = require("node-tsv-json");
tsv({
    input: "170319/_01.ivc",
    output: "output.json"
    //array of arrays, 1st array is column names
    ,parseRows: false
}, function(err, result) {
    if(err) {
        console.error(err);
    }else {
        console.log(result);

    }
});