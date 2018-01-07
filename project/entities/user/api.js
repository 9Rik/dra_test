module.exports.auth = auth;

const Model = require("./model");

function auth(req, res, next){
    var login = res.connection.user;
    var session_id = res.connection.userSid;
    Model.find(login).then((user) => {
        var create;
        if(user.length == 0) {
            create = Model.create(login, session_id)
        };
        function auth(){
            return Model.auth(login, session_id);
        }
        return create?create.then(auth):auth();
    })
    .then(() => next())
    .catch((e) => console.error(e));    
}