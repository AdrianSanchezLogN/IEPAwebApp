/**
* @description Functions used by category services
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
* @description Gets information from one or all the categories
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
* @returns {JSON} information related to the category
*/
exports.findCategory = function(req, res) {
    headers.basicHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            if (! isNaN(id)) {
                console.log('Returning category: ' + id);
                db.collection('category', function(err, collection_category) {
                    try {
                        collection_category.findOne({_id: parseInt(id)}, function(err, item) {
                            res.send(200, item);
                        });
                    }
                    catch (err){
                        res.send(409, err);
                    }
                });
            }
            else if(typeof(id) == 'undefined') {
                console.log('Returning all categories');
                db.collection('category', function(err, collection_category) {
                    collection_category.find().toArray(function(err, items) {
                        //items
                        res.send(200, items);
                    });
                });                    
            }
            else {
                res.send(406, {'error': 'Id not valid'});                    
            }            
        }
        else {
            res.send(401, {'error':'Authorization failed'});
        }
    });
};


/**
* @description Insert a new category in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the JSON information) send to the server and the response return by the server
* @returns {JSON} information related to the category
*/ 
exports.addCategory = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var category = req.body;
            console.log('--Registering category: ' + JSON.stringify(category));
            db.collection('id', function(err, collection_id) {
                collection_id.find({},{category: 1, _id: 0}).toArray(function(err, items) {
                    db.collection('category', function(err, collection_category) {
                        category['_id'] = parseInt(items[0].category);
                        collection_category.insert(category, {safe: true}, function(err, result) {
                            if (err) {
                                res.send(409, {'error': 'An error inserting the category has occurred'});
                            } else {
                                collection_id.update({_id: 1}, {$inc: {'category': 1}}, {safe: true}, function(err, result) {
                                    if (err) {
                                        console.log('Error updating id: ' + err);
                                        res.send(409, {'error': 'An error updating the id has occurred'});
                                    } 
                                    else {
                                        console.log('' + result + ' document(s) updated');
                                        res.send(200, category);
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
* @description Update a category in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id and the JSON information) send to the server and the response return by the server
* @returns {JSON} information updated of the category
*/  
exports.updateCategory = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            var category = req.body;
            if(!isNaN(id)) {
                console.log('Updating category: ' + id);
                db.collection('category', function(err, collection_category) {
                    collection_category.update({_id: parseInt(id)}, {$set: category}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('Error updating category: ' + err);
                            res.send(409, {'error': 'An error has occurred updating the category'});
                        } 
                        else {
                            console.log('' + result + ' document(s) updated');
                            res.send(200, category);
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
* @description Removing a category from the DB and the category from the product categories and the user recentCategories
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
*/  
exports.deleteCategory = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            if(!isNaN(id)) {
                console.log('Deleting category: ' + id);
                db.collection('user', function(err, collection_user){
                    collection_user.update({recentCategories: parseInt(id)}, {$pull: {recentCategories: parseInt(id)}}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('Error pulling from users the category: ' + err);
                            res.send(409, {'error': 'An error has occurred pulling from users the category'});
                        } 
                        else {
                            console.log('' + result + ' document(s) updated');
                        }
                    })
                });
                db.collection('product', function(err, collection_product){
                    collection_product.update({category: parseInt(id)}, {$pull: {category: parseInt(id)}}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('Error pulling from products the category: ' + err);
                            res.send(409, {'error': 'An error has occurred pulling from products the category'});
                        } 
                        else {
                            console.log('' + result + ' document(s) updated');
                        }
                    });
                });
                db.collection('category', function(err, collection_category) {
                    collection_category.remove({_id: parseInt(id)}, {safe: true}, function(err, result) {
                        if (err) {
                            res.send(409, {'error': 'An error has occurred deleting the category - ' + err});
                        } 
                        else {
                            console.log('' + result + ' document(s) deleted');
                            res.send(200, {'info': 'Category removed correct'});
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

