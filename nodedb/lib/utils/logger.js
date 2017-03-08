(function(){

    exports.consoleMessage = function(msg , tags){
        var dated = new Date();

        var messenger = {
            date :  dated,
            message : msg,
            tag: tags
        };
        console.log(JSON.stringify(messenger));
    };
})();