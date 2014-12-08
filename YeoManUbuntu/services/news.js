/**
* @description Functions used by the news services
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
* @description Gets information from one or all the news
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
* @returns {JSON} information related to the news
*/
exports.findNews = function(req, res) {
    headers.basicHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id,
                skip = req.query.skip;
            if (! isNaN(id)) {
                console.log('Returning news: ' + id);
                db.collection('news', function(err, collection_news) {
                    try {
                        collection_news.findOne({_id: parseInt(id)}, function(err, item) {
                            res.send(200, item);
                        });
                    }
                    catch (err){
                        res.send(409, err);
                    }
                });
            }
            else if(typeof(id) == 'undefined') {
                console.log('Returning all news');
                db.collection('news', function(err, collection_news) {
                    collection_news.find().toArray(function(err, items) {
                        if(skip<0){
                            collection_news.find().toArray(function(err, items) {
                                res.send(200, items);
                            });
                        }
                        else{
                            collection_news.find().count(function(err, value){
                                collection_news.find().skip(parseInt((skip-1)*3)).limit(3).toArray(function(err, items) {
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
* @description Insert a new news in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the JSON information) send to the server and the response return by the server
* @returns {JSON} information related to the news
*/ 
exports.addNews = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var news = req.body;
            db.collection('id', function(err, collection_id) {
                collection_id.find({},{news: 1, _id: 0}).toArray(function(err, items) {
                    db.collection('news', function(err, collection_news) {
                        news['_id'] = parseInt(items[0].news);

                        console.log('--Registering news: ' + JSON.stringify(news));
                        collection_news.insert(news, {safe: true}, function(err, result) {
                            if (err) {
                                res.send(409, {'error': 'An error inserting the news has occurred'});
                            } else {
                                collection_id.update({_id: 1}, {$inc: {'news': 1}}, {safe: true}, function(err, result) {
                                    if (err) {
                                        console.log('Error updating id: ' + err);
                                        res.send(490, {'error': 'An error updating the id has occurred'});
                                    } 
                                    else {
                                        console.log('' + result + ' document(s) updated');
                                        res.send(200, news);
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
* @description Update a news in the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id and the JSON information) send to the server and the response return by the server
* @returns {JSON} information updated of the news
*/  
exports.updateNews = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            var news = req.body;
            if(!isNaN(id)) {
                console.log('Updating news: ' + id);
                db.collection('news', function(err, collection_news) {
                    collection_news.update({_id: parseInt(id)}, {$set: news}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('Error updating news: ' + err);
                            res.send(409, {'error': 'An error has occurred updating the news'});
                        } 
                        else {
                            console.log('' + result + ' document(s) updated');
                            res.send(200, news);
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
* @description Removing a news from the DB
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
*/  
exports.deleteNews = function(req, res) {
    headers.authorizationHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            if(!isNaN(id)) {
                db.collection('news', function(err, collection_news) {
                    collection_news.remove({_id: parseInt(id)}, {safe: true}, function(err, result) {
                        if (err) {
                            res.send(409, {'error': 'An error has occurred deleting the news - ' + err});
                        } 
                        else {
                            console.log('' + result + ' document(s) deleted');
                            res.send(200, {'info': 'news removed correct'});
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



