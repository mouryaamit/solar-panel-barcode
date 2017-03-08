(function(){

    var _ = require('underscore');

    var configFile = require('../lib/prop/serverConfig');

    var dbConn = require('../lib/prop/globalConnObj');

    var channelConfig =  require('../gen/channelConfig');

    var OnConnectionComplete = function OnConnectionComplete(service , dbPath){
        this.service = service;
        this.dbPath = dbPath;
    };

    OnConnectionComplete.prototype = {
        connectionStatus: function(callback, config){

            var that = this;
            var utils = require('../lib/utils/utils');
            var logger = utils.util();
            var log = '';
            var db = dbConn.getdbConn(this.service);

            require('../lib/models/dbModel').modelForService(this.service);

            //# check for the mongodb connection Success
            db.on('open', function () {
                //# Create models for the Db connection
            });

            db.on('connected', function () {
                log = {id: 'MongoConnectionSuccess',msg: "Connection was Succesfull made to : " + that.dbPath};
                logger.log('Database Connect', log , config.tags.MongoConnection);

                dbConn.dbConnUp(that.service);
                if(callback != null)
                    callback(config);
            });

            //# check for the mongodb connection Error
            db.on('error', function (err) {

                log = {id: 'MongoConnectionError',msg: "Connection Error : " + that.dbPath};
                logger.log('Database Error', log, config.tags.MongoConnection);
            });

            db.on('disconnected', function (err) {
                dbConn.dbConnDown(that.service);
                log = {id: 'MongoConnectionDown',msg: "Connection is Down : " + that.dbPath};
                logger.log('Database Down', log , config.tags.MongoConnection);


                dbConn.createDb(that.service, that.dbPath);

                //# Use DbConnection mongoose Instance
                db = dbConn.getdbConn(that.service);
            });
        }
    };

    var DbManager = function DbManager(callback, downReason){

        var configObj = configFile('systemConfig');
        configObj.populate();
        var config = configObj.getConfig();

        var dbPath = config.mongoDb.dbPath;
        //# Create a Db connection
        var createDb = dbConn.createDb('Channel' , dbPath);

        //# Use DbConnection mongoose Instance
        var connection = new OnConnectionComplete('Channel' , dbPath);
        config.downTimeReason = downReason || 'no reason was provided';
        connection.connectionStatus(callback, config);

        /*var database = channelConfig.getChannelConfig();
        _.each(database, function (databaseObj) {

            var configObj = configFile(databaseObj.serviceFileName);
            configObj.populate();
            var config = configObj.getConfig();

            var dbPath = config.mongoDb.dbPath;
            //# Create a Db connection
            var createDb = dbConn.createDb(databaseObj.service , dbPath);

            //# Use DbConnection mongoose Instance
            var connection = new OnConnectionComplete(databaseObj.service , dbPath);
            config.downTimeReason = downReason || 'no reason was provided';
            connection.connectionStatus(callback, config);
        });*/
    };

    module.exports = function(callback, downReason){
        return (new DbManager(callback, downReason));
    };
})();