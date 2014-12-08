/**
* @description Functions used by craftsman services
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('IEPA_Database', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'IEPA_Database' database");
    }
    else{
        console.log(404, 'Error Connecting to "IEPA_Database" database');
    }
});

/**
* @description Gets information from one or all the craftsmen
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
* @returns {JSON} information related to the craftsman
*/
exports.findCraftsman = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            if (! isNaN(id)) {
                console.log('Returning craftsman: ' + id);
                db.collection('craftsman', function(err, collection_craftsman) {
                    try {
                        collection_craftsman.findOne({_id:parseInt(id)}, function(err, item) {
                            res.send(200, item);
                        });
                    }
                    catch (err){
                        res.send(409, err);
                    }
                });
            }
            else if(typeof(id) == 'undefined') {
                console.log('Returning all craftsmen');
                db.collection('craftsman', function(err, collection_craftsman) {
                    collection_craftsman.find().toArray(function(err, items) {
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
* @description Insert a new craftsman in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the JSON information) send to the server and the response return by the server
* @returns {JSON} information related to the craftsman
*/ 
exports.addCraftsman = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var craftsman = req.body;
            console.log('--Registering craftsman: ' + JSON.stringify(craftsman));
            db.collection('id', function(err, collection_id) {
                collection_id.find({},{craftsman: 1, _id: 0}).toArray(function(err, items) {
                    db.collection('craftsman', function(err, collection_craftsman) {
                        craftsman['_id'] = parseInt(items[0].craftsman);
                        collection_craftsman.insert(craftsman, {safe: true}, function(err, result) {
                            if (err) {
                                res.send(409, {'error': 'An error inserting the craftsman has occurred'});
                            } else {
                                collection_id.update({_id: 1}, {$inc: {'craftsman': 1}}, {safe: true}, function(err, result) {
                                    if (err) {
                                        console.log('Error updating id: ' + err);
                                        res.send(409, {'error': 'An error updating the id has occurred'});
                                    } 
                                    else {
                                        console.log('' + result + ' document(s) updated');
                                        res.send(200, craftsman);
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
* @description Update a craftsman in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id and the JSON information) send to the server and the response return by the server
* @returns {JSON} information updated of the craftsman
*/  
exports.updateCraftsman = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            var craftsman = req.body;
            if(!isNaN(id)) {
                console.log('Updating craftsman: ' + id);
                db.collection('craftsman', function(err, collection_craftsman) {
                    collection_craftsman.update({_id: parseInt(id)}, {$set: craftsman}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('Error updating craftsman: ' + err);
                            res.send(409, {'error': 'An error has occurred updating the craftsman'});
                        } 
                        else {
                            console.log('' + result + ' document(s) updated');
                            res.send(200, craftsman);
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
* @description Removing a craftsman from the DB and the craftsman from the product craftman
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
*/  
exports.deleteCraftsman = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            if(!isNaN(id)) {
                console.log('Deleting craftsman: ' + id);
                db.collection('product', function(err, collection_product){
                    collection_product.update({craftsman: parseInt(id)}, {$pull: {craftsman: parseInt(id)}}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('Error pulling from products the craftsman: ' + err);
                            res.send(409, {'error': 'An error has occurred pulling from products the craftsman'});
                        } 
                        else {
                            console.log('' + result + ' document(s) updated');
                        }
                    });
                });
                db.collection('craftsman', function(err, collection_craftsman) {
                    collection_craftsman.remove({_id: parseInt(id)}, {safe: true}, function(err, result) {
                        if (err) {
                            res.send(409, {'error': 'An error has occurred deleting the craftsman - ' + err});
                        } 
                        else {
                            console.log('' + result + ' document(s) deleted');
                            res.send(200, {'info': 'craftsman removed correct'});
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



