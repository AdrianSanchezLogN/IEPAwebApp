/**
* @description Functions used by category services
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

var mongo = require('mongodb');
    headers = require('./headers');
	fs = require('fs');
 
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


exports.addImage = function(req, res) {
	headers.authorizationHeadersSubmit(req, res, function(callback){
        if(callback) {
			var path = ('images/' + req.files.image.name),
				url = req.files.image.path,
				image = {};
				fs.readFile(url, function (err, data) {
				  fs.writeFile(('./admin/app/' + path), data, function (err) {
					if (err) {
                        throw err;
                    }
                      else{
                        res.send(200, {'info': 'Image Uploaded'});
                    }                       
				});
			});
		}
        else {
            res.send(401, {'error': 'Authorization failed'});
        }
    });
}

