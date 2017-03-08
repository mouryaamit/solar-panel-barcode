module.exports = function(){
    return function(req , res , next){
        var csrf = req.csrfToken();
        res.set({
            'x-csrf-token' : csrf
        });
        next();
    };
};