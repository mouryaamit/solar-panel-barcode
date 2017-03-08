(function(){

    var channel = [
        {
            service: 'iris', //Name of the Header [x-service]
            serviceFileName: 'iris' //Name of the file at '/nodedb/lib/config  Name of the header x-config'
        }/*,
        {
            service: 'pacs',
            serviceFileName: 'pacs'
        }*/
    ];

    module.exports.getChannelConfig = function(){
        return channel;
    };
})();