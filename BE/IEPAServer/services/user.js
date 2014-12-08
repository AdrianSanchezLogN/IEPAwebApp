/**
* @description Functions used by user services
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
* @description Gets information from one or all the users
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
* @returns {JSON} information related to the user
*/
exports.findUser = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            if (! isNaN(id)) {
                console.log('Returning user: ' + id);
                db.collection('user', function(err, collection_user) {
                    try {
                        collection_user.findOne({_id: parseInt(id)}, function(err, item) {
                            res.send(200, item);
                        });
                    }
                    catch (err){
                        res.send(409, err);
                    }
                });
            }
            else if(typeof(id) == 'undefined'){

                console.log('Returning all users');
                db.collection('user', function(err, collection_user) {
                    collection_user.find().toArray(function(err, items) {
                        res.send(200, items);
                    });
                });
            }
            else {                
                res.send(406, {'error': 'Id not valid'});
            }
        }
        else {
            res.send(401, {'error': 'Authorization failed'});
        }
    });
};


/**
* @description Insert a new user in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the JSON information) send to the server and the response return by the server
* @returns {JSON} information related to the user
*/ 
exports.registerUser = function(req, res) {
    headers.basicHeaders(req, res, function(callback){
        if(callback) {
            var user = req.body;
                email = user['email'];

            user['registrationDate'] = new Date();
            user['sessionDate'] = new Date();
            user['birthday'] = new Date(user['birthday']);

            console.log('--Registering user: ' + JSON.stringify(user));
            db.collection('id', function(err, collection_id) {
                    collection_id.find({},{user: 1, email: 1, _id: 0}).toArray(function(err, items) {
                        db.collection('email', function(err, collection_email) {
                                collection_email.insert({_id: parseInt(items[0].user), 'email': email}, {safe: true}, function(err, result) {
                                    if (err) {
                                        res.send(409, {'error': 'An error has occurred, email already in use'});
                                    } 
                                    else {
                                        db.collection('user', function(err, collection_user) {
                                            user['_id'] = parseInt(items[0].user);
                                            user['email'] = parseInt(items[0].email);
                                            collection_user.insert(user, {safe: true}, function(err, result) {
                                                if (err) {
                                                    res.send(409, {'error': 'An error inserting the user has occurred'});
                                                } else {
                                                    collection_id.update({_id: 1}, {$inc: {'user': 1, 'email': 1}}, {safe: true}, function(err, result) {
                                                        if (err) {
                                                            console.log('Error updating id: ' + err);
                                                            res.send(409, {'error': 'An error updating the id has occurred'});
                                                        } 
                                                        else {
                                                            console.log('' + result + ' document(s) updated');
                                                            res.send(200, user);
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                    });
                });
        }
        else {
            res.send(401, {'error': 'Authorization failed'});
        }
    });
}

/**
* @description Update a user in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id and the JSON information) send to the server and the response return by the server
* @returns {JSON} information updated of the user
*/  
exports.updateUser = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            var user = req.body;
            if(!isNaN(id)) {
                console.log('Updating user: ' + id);
                db.collection('user', function(err, collection_user) {
                    collection_user.update({_id: parseInt(id)}, {$set: user}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('Error updating user: ' + err);
                            res.send(409, {'error': 'An error has occurred updating the user'});
                        } 
                        else {
                            console.log('' + result + ' document(s) updated');
                            res.send(200, user);
                        }
                    });
                });
            }
            else {
                res.send(406, {'error': 'Id not valid'});
            }
        }
    else {
            res.send(401, {'error': 'Authorization failed'});
        }
    });
}

/**
* @description Removing a user from the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
* @returns {JSON} information updated of the user
*/  
exports.deleteUser = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            if(!isNaN(id)) {
                console.log('Deleting user: ' + id);
                db.collection('user', function(err, collection_user) {
                    collection_user.remove({_id: parseInt(id)}, {safe: true}, function(err, result) {
                        if (err) {
                            res.send(409, {'error': 'An error has occurred deleting the user - ' + err});
                        } 
                        else {
                            console.log('' + result + ' document(s) deleted');
                            res.send(200, {'info': 'User removed correct'});
                        }
                    });
                });
            }
            else {
                res.send(406, {'error': 'Id not valid'});
            }
        }
        else {
            res.send(401, {'error': 'Authorization failed'});
        }
    });
}

