/**
* @description Functions used by community services
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
* @description Gets information from one or all the communities
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
* @returns {JSON} information related to the community
*/
exports.findCommunity = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            if (! isNaN(id)) {
                console.log('Returning community: ' + id);
                db.collection('community', function(err, collection_community) {
                    try {
                        collection_community.findOne({_id: parseInt(id)}, function(err, item) {
                            res.send(200, item);
                        });
                    }
                    catch (err){
                        res.send(409, err);
                    }
                });
            }
            else if(typeof(id) == 'undefined') {
                console.log('Returning all communities');
                db.collection('community', function(err, collection_community) {
                    collection_community.find().toArray(function(err, items) {
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
* @description Insert a new community in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the JSON information) send to the server and the response return by the server
* @returns {JSON} information related to the community
*/ 
exports.addCommunity = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var community = req.body;
            console.log('--Registering community: ' + JSON.stringify(community));
            db.collection('id', function(err, collection_id) {
                collection_id.find({},{community: 1, _id: 0}).toArray(function(err, items) {
                    db.collection('community', function(err, collection_community) {
                        community['_id'] = parseInt(items[0].community);
                        collection_community.insert(community, {safe: true}, function(err, result) {
                            if (err) {
                                res.send(409, {'error': 'An error inserting the community has occurred'});
                            } else {
                                collection_id.update({_id: 1}, {$inc: {'community': 1}}, {safe: true}, function(err, result) {
                                    if (err) {
                                        console.log('Error updating id: ' + err);
                                        res.send(490, {'error': 'An error updating the id has occurred'});
                                    } 
                                    else {
                                        console.log('' + result + ' document(s) updated');
                                        res.send(200, community);
                                    }
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
* @description Update a community in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id and the JSON information) send to the server and the response return by the server
* @returns {JSON} information updated of the community
*/  
exports.updateCommunity = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            var community = req.body;
            if(!isNaN(id)) {
                console.log('Updating community: ' + id);
                db.collection('community', function(err, collection_community) {
                    collection_community.update({_id: parseInt(id)}, {$set: community}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('Error updating community: ' + err);
                            res.send(409, {'error': 'An error has occurred updating the community'});
                        } 
                        else {
                            console.log('' + result + ' document(s) updated');
                            res.send(200, community);
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
* @description Removing a community from the DB and the community from the craftsman communities
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
*/  
exports.deleteCommunity = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            if(!isNaN(id)) {
                console.log('Deleting community: ' + id);
                db.collection('craftsman', function(err, collection_craftsman){
                    collection_craftsman.update({community: parseInt(id)}, {$pull: {community: parseInt(id)}}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('Error pulling from craftsmen the community: ' + err);
                            res.send(409, {'error': 'An error has occurred pulling from the craftsmen the community'});
                        } 
                        else {
                            console.log('' + result + ' document(s) updated');
                        }
                    })
                });
                db.collection('community', function(err, collection_community) {
                    collection_community.remove({_id: parseInt(id)}, {safe: true}, function(err, result) {
                        if (err) {
                            res.send(409, {'error': 'An error has occurred deleting the community - ' + err});
                        } 
                        else {
                            console.log('' + result + ' document(s) deleted');
                            res.send(200, {'info': 'Community removed correct'});
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



