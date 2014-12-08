/**
* @description Functions used by product services
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('IEPA_Database', server);
 
db.open(function(err, db) {
    if (!err) {
        console.log("Connected to 'IEPA_Database' database");
    }
    else{
        console.log(404, 'Error Connecting to "IEPA_Database" database' + err);
    }
});


/**
* @description Search the products information that matches some criteria
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id, category, material, crafstman or keys) 
* send to the server and the response return by the server
* @returns {JSON} information related to the product
*/
exports.findProduct = function(req, res) {
    headers.basicHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id,
                cate = req.query.cate1,
                craft = req.query.craft,
                key = req.query.key1,
                mate = req.query.mate,
          		skip = req.query.skip;
            if (typeof(cate) != "undefined"){
                findProductCate(req,res,cate)
            }
            else if (typeof(craft) != "undefined"){
                findProductCraft(req,res,craft)
            }
            else if (typeof(key) != "undefined"){
                findProductKey(req,res)
            }
            else if (typeof(mate) != "undefined"){
                findProductMate(req,res,mate)
            }
            else if (! isNaN(id)) {
                console.log('Returning product: ' + id);
                db.collection('product', function(err, collection) {
                    collection.findOne({_id: parseInt(id)}, function(err, item) {
                        res.send(200, item);
                    });
                });
            }
            else if (typeof(id) == "undefined") {
                console.log('Returning all products');
                db.collection('product', function(err, collection) {
                   if(skip<0){
				    collection.find().toArray(function(err, items) {
				      res.send(200, items);
				    });
				  }
				  else{
				    collection.find().count(function(err, value){
				      collection.find().skip(parseInt((skip-1)*3)).limit(3).toArray(function(err, items) {
				        items.push({count: value});
				        res.send(200, items);
				      });
				    });
				  }
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

// ------------------------------------------------
// description Search the products information that matches some category
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {req, res, Int} request send to the server, 
// the response return by the server and the category id
// returns {JSON} information related to the category
findProductCate = function(req,res,cate){
    var i = req.url.indexOf('?');
        query = req.url.substr(i+1);
        quant = query.split('&').length;
        categories = query.replace('cate1=', '');
        categoriesArray = [],
        keywords = '',
        keywordsArray = [];

    for (x=1; x<quant; x++){
        categories = categories.replace(/&cate(\d)*/, '');
    }
    categoriesArray = categories.split('key1=')[0];
    keywords = categories.split('key1=')[1];
    categoriesArray = categoriesArray.replace('&', '');
    categoriesArray = categoriesArray.split("=");
    for (x=1; x<quant; x++){
        keywords = keywords.replace(/&key(\d)*/, '');
    }
    keywordsArray = keywords.split("=");
    categoriesArray = categoriesArray.map(Number);
    console.log('Returning products with the categories: ' + categoriesArray + keywordsArray);
    if (keywords == []){
        db.collection('product', function(err, collection) {
            try {
                collection.find({category: {$elemMatch : {$in: categoriesArray}}}).toArray(function(err, items) {
                    console.log(items);
                    res.send(200, items);
                });
            }
            catch (err){
                res.send(409, err);
            }
        });
    }
    else {
        db.collection('product', function(err, collection) {
            try {
                collection.find({'$and':[{keyword: {$elemMatch : {$in: keywordsArray}}}, {category: {$elemMatch : {$in: categoriesArray}}}]}).toArray(function(err, items) {
                    console.log(items);
                    res.send(200, items);
                });
            }
            catch (err){
                res.send(409, err);
            }
        });
    }
}

// ------------------------------------------------
// description Search the products information that matches some craftsman
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {req, res, Int} request send to the server, 
// the response return by the server and the craftsman id
// returns {JSON} information related to the craftsman
findProductCraft = function(req,res,craft){
    console.log('Returning products from the craftsman: ' + craft);
    db.collection('product', function(err, collection) {
        try {
            collection.find({craftsman:parseInt(craft)}).toArray(function(err, items) {
                res.send(200, items);
            });
        }
        catch (err){
            res.send(409, err);
        }
    });
}

// ------------------------------------------------
// description Search the products information that matches some keywords
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {req, res} request (with the keywords) send to the server and 
// the response return by the server
// returns {JSON} information related to the craftsman
findProductKey = function(req,res){
    var i = req.url.indexOf('?');
        query = req.url.substr(i+1);
        quant = query.split('&').length;
        keywords = query.replace('key1=', '');
        keywordsArray = [];

    for (x=1; x<quant; x++){
        keywords = keywords.replace(/&key(\d)*/, '');
    }
    
    keywordsArray = keywords.split("=");
    console.log('Returning products with the keywords: ' + keywordsArray);
    db.collection('product', function(err, collection) {
        try {
            collection.find({keyword: {$elemMatch : {$in: keywordsArray}}}).toArray(function(err, items) {
                res.send(200, items);
            });
        }
        catch (err){
            res.send(409, err);
        }
    });
} 

// ------------------------------------------------
// description Search the products information that matches some material
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {req, res, Int} request send to the server, 
// the response return by the server and the material id
// returns {JSON} information related to the material
findProductMate = function(req,res,mate){
    console.log('Returning products from the material: ' + mate);
    db.collection('product', function(err, collection) {
        try {
            collection.find({material:parseInt(mate)}).toArray(function(err, items) {
                res.send(200, items);
            });
        }
        catch (err){
            res.send(409, err);
        }
    });
}

/**
* @description Insert a new product in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the JSON information) send to the server and the response return by the server
* @returns {JSON} information related to the product
*/ 
exports.addProduct = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var product = req.body;
            console.log('--Registering product: ' + JSON.stringify(product));
            db.collection('id', function(err, collection_id) {
                collection_id.find({},{product: 1, _id: 0}).toArray(function(err, items) {
                    db.collection('product', function(err, collection_product) {
                        product['_id'] = parseInt(items[0].product);
                        collection_product.insert(product, {safe: true}, function(err, result) {
                            if (err) {
                                res.send(409, {'error': 'An error inserting the product has occurred'});
                            } else {
                                collection_id.update({_id: 1}, {$inc: {'product': 1}}, {safe: true}, function(err, result) {
                                    if (err) {
                                        console.log('Error updating id: ' + err);
                                        res.send(409, {'error': 'An error updating the id has occurred'});
                                    } 
                                    else {
                                        console.log('' + result + ' document(s) updated');
                                        res.send(200, product);
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
* @description Update a product in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id and the JSON information) send to the server and the response return by the server
* @returns {JSON} information updated of the product
*/  
exports.updateProduct = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            var product = req.body;
            if(!isNaN(id)){
                console.log('Updating product: ' + id);
                db.collection('product', function(err, collection) {
                    collection.update({_id:parseInt(id)}, {$set:product}, {safe:true}, function(err, result) {
                        if (err) {
                            console.log('Error updating product: ' + err);
                            res.send(409, {'error': 'An error has occurred updating the product'});
                        } else {
                            console.log('' + result + ' document(s) updated');
                            res.send(200, product);
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
* @description Removing a product from the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
*/  
exports.deleteProduct = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            if(!isNaN(id)){
                console.log('Deleting product: ' + id);
                db.collection('product', function(err, collection) {
                    collection.remove({_id:parseInt(id)}, {safe:true}, function(err, result) {
                        if (err) {
                            res.send(409, {'error': 'An error has occurred deleting the product - ' + err});
                        } else {
                            console.log('' + result + ' document(s) deleted');
                            res.send(200, {'info': 'Product removed correct'});
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
* @description Update a product in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id and the JSON information) send to the server and the response return by the server
* @returns {JSON} information updated of the product
*/  
exports.addImageProduct = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            var image = req.body;
            if(!isNaN(id)){
                console.log('Updating product: ' + id);
                db.collection('product', function(err, collection) {
                    collection.update({_id:parseInt(id)}, {$addToSet:image}, {safe:true}, function(err, result) {
                        if (err) {
                            console.log('Error updating product: ' + err);
                            res.send(409, {'error': 'An error has occurred updating the product'});
                        } else {
                            console.log('' + result + ' document(s) updated');
                            res.send(200, product);
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
* @description Update a product in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id and the JSON information) send to the server and the response return by the server
* @returns {JSON} information updated of the product
*/  
exports.removeImageProduct = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            var image = req.body;
            if(!isNaN(id)){
                console.log('Updating product: ' + id);
                db.collection('product', function(err, collection) {
                    collection.update({_id:parseInt(id)}, {$pull:image}, {safe:true}, function(err, result) {
                        if (err) {
                            console.log('Error updating product: ' + err);
                            res.send(409, {'error': 'An error has occurred updating the product'});
                        } else {
                            console.log('' + result + ' document(s) updated');
                            res.send(200, product);
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
