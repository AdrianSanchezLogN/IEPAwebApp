/**
* @description Functions used by material services
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
* @description Gets information from one or all the materials
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
* @returns {JSON} information related to the material
*/
exports.findMaterial = function(req, res) {
    headers.basicHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id,
                skip = req.query.skip;
            if (! isNaN(id)) {
                console.log('Returning material: ' + id);
                db.collection('material', function(err, collection_material) {
                    try {
                        collection_material.findOne({_id: parseInt(id)}, function(err, item) {
                            res.send(200, item);
                        });
                    }
                    catch (err){
                        res.send(409, err);
                    }
                });
            }
            else if(typeof(id) == 'undefined'){
                console.log('Returning all materials');
                db.collection('material', function(err, collection_material) {
                    collection_material.find().toArray(function(err, items) {
                        if(skip<0){
                            collection_material.find().toArray(function(err, items) {
                                res.send(200, items);
                            });
                        }
                        else{
                            collection_material.find().count(function(err, value){
                                collection_material.find().skip(parseInt((skip-1)*3)).limit(3).toArray(function(err, items) {
                                    items.push({count: value});
                                    res.send(200, items);
                                });
                            });
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
};


/**
* @description Insert a new material in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the JSON information) send to the server and the response return by the server
* @returns {JSON} information related to the material
*/ 
exports.addMaterial = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var material = req.body;
            console.log('--Registering material: ' + JSON.stringify(material));
            db.collection('id', function(err, collection_id) {
                collection_id.find({},{material: 1, _id: 0}).toArray(function(err, items) {
                    db.collection('material', function(err, collection_material) {
                        material['_id'] = parseInt(items[0].material);
                        collection_material.insert(material, {safe: true}, function(err, result) {
                            if (err) {
                                res.send(409, {'error': 'An error inserting the material has occurred'});
                            } else {
                                collection_id.update({_id: 1}, {$inc: {'material': 1}}, {safe: true}, function(err, result) {
                                    if (err) {
                                        console.log('Error updating id: ' + err);
                                        res.send(409, {'error': 'An error updating the id has occurred'});
                                    } 
                                    else {
                                        console.log('' + result + ' document(s) updated');
                                        res.send(200, material);
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
* @description Update a material in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id and the JSON information) send to the server and the response return by the server
* @returns {JSON} information updated of the material
*/  
exports.updateMaterial = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            var material = req.body;
            if(!isNaN(id)) {
                console.log('Updating material: ' + id);
                db.collection('material', function(err, collection_material) {
                    collection_material.update({_id: parseInt(id)}, {$set: material}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('Error updating material: ' + err);
                            res.send(409, {'error': 'An error has occurred updating the material'});
                        } 
                        else {
                            console.log('' + result + ' document(s) updated');
                            res.send(200, material);
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
* @description Removing a material from the DB and material from the product material
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
*/  
exports.deleteMaterial = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            if(!isNaN(id)) {
                console.log('Deleting material: ' + id);
                db.collection('product', function(err, collection_product){
                    collection_product.update({material: parseInt(id)}, {$pull: {material: parseInt(id)}}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('Error pulling from products the material: ' + err);
                            res.send(409, {'error': 'An error has occurred pulling from products the material'});
                        } 
                        else {
                            console.log('' + result + ' document(s) updated');
                            db.collection('material', function(err, collection_material) {
                                collection_material.remove({_id: parseInt(id)}, {safe: true}, function(err, result) {
                                    if (err) {
                                        res.send(409, {'error': 'An error has occurred deleting the material - ' + err});
                                    } 
                                    else {
                                        console.log('' + result + ' document(s) deleted');
                                        res.send(200, {'info': 'Material removed correct'});
                                    }
                                });
                            });
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

