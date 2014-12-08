/**
* @description Functions used by login/logout services
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

var mongo = require('mongodb');
    headers = require('./headers');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('IEPA_Database', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log('Connected to "IEPA_Database" database');
    }
    else{
        console.log(404, 'Error Connecting to "IEPA_Database" database');
    }
});


/**
* @description Login a user in the database (setting the sessionValue)
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the email and password) send to the server and the response return by the server
* @returns {Int} session_token
*/ 
exports.logIn = function(req, res) {
    headers.basicHeaders(req, res, function(callback){
        if(callback) {
            var email = req.body['email'];
                password = req.body['pass'];
            if ((typeof(email) == 'undefined') || (typeof(password) == 'undefined')) {
                res.send(401, {'error': 'Email or Password invalid'}); 
            }
            else {
                console.log('Logging in user...');
                db.collection('email', function(err, collection_email) {
                    try {
                        collection_email.findOne({email: email}, function(err, item) {
                            if(item != null){
                                db.collection('user', function(err, collection_user) {
                                    collection_user.findOne({email: item._id, password: password}, function(err, items){
                                        if(items != null){
                                            console.log('User accepted');
                                            collection_user.update({_id: items._id}, {$set: {sessionValue: 1, sessionDate: (new Date()), sessionLogIn: (new Date())}}, {safe: true}, function(err, result) {
                                                if (err) {
                                                    console.log('Error updating sessionValue: ' + err);
                                                    res.send(409, {'error': 'An error has occurred updating the sessionValue'});
                                                } 
                                                else {
                                                    console.log('' + result + ' document(s) updated');
                                                    res.send(200, {'User' : items.name, 'id' : items._id, "session_token" : items.sessionValue});
                                                }
                                            });
                                        }
                                        else {
                                            res.send(401, {'error': 'Email or password incorrect'});
                                        }
                                    })
                                });
                            }
                            else {
                                res.send(401, {'error': 'Email or password incorrect'});
                            }
                        });
                    }
                    catch (err){
                        res.send(409, err);
                    }
                });                    
            }            
        }
        else {
            res.send(401, {'error': 'Authorization failed'});
        }
    });
};


/**
* @description Logout a user in the database (setting the sessionValue)
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the email and password) send to the server and the response return by the server
*/ 
exports.logOut = function(req, res) {
    headers.basicHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            console.log('Logging out user...' + id);
            db.collection('user', function(err, collection_user) {
                try {
                    collection_user.update({_id: parseInt(id)}, {$set: {sessionValue: "", sessionLogOut: (new Date())}}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('Error updating sessionValue: ' + err);
                            res.send(409, {'error': 'An error has occurred updating the sessionValue'});
                        } 
                        else {
                            console.log('' + result + ' document(s) updated');
                            res.send(200, {'info':'User logout'});
                        }
                    });
                }
                catch (err){
                    res.send(409, err);
                }
            });                                
        }
        else {
            res.send(401, {'error': 'Authorization failed'});
        }
    });
};
