(function(){

    var _ = require('underscore');

    module.exports = {
       // mongoose : mongoose,
        //db :{},
        //down: false,
        connections: {},
        activeUser : [],
        createDb : function(service , dbPath){
            //this.db = mongoose.connect(dbPath);
            this.connections[service] = {
                mongoose : {},
                db : {},
                down : false
            };

            this.connections[service]['mongoose'] = require('mongoose');
            this.connections[service]['db'] = this.connections[service]['mongoose'].createConnection(dbPath, {server: {poolSize: 5}});

        },
        getdbConn : function(service){
            return this.connections[service]['db'];
        },
        getConnMongoose : function(service){
            return this.connections[service]['mongoose'];
        },
        dbConnDown : function(service){
            return this.connections[service]['down'] = true;
        },
        dbConnUp : function(service){
            return this.connections[service]['down'] = false;
        },
        isDown : function(service){
            return this.connections[service]['down'];
        },
        addActiveUser : function(session , active){
            var activity = {
                userId      : active,
                sessionId   : session
            };

            this.activeUser.push(activity);
        },
        removeActiveUser : function(active){
            var activity = _.findWhere(this.activeUser, {userId : active});
            var index = this.activeUser.indexOf(activity);
            this.activeUser.splice(index , 1);
        },
        getActiveUser: function(active){

            return _.findWhere(this.activeUser, {userId : active});
        }
    }
})();