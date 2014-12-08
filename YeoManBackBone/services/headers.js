/**
* @description Function used to verify the headers authorization
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/


/**
* @description Callback function that returns true if there are only valid headers
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res, function} request send to the server, response return by the server and the callback parameter 
* @returns {Bool} true if there are only valid headers and the session_token is authorized
* @headers Content-type: application/json, Accept: application/json and Authorization: session_token=value
*/
exports.authorizationHeaders = function(req, res, callback) {
    var token = req.headers['authorization'].split('=');
        id = req.query.user;
        date = new Date();
    if((req.headers['content-type'] == 'application/json')
        && (req.headers['accept'] == 'application/json') 
        && (token[0] == 'session_token')){
        db.collection('user', function(err, collection_user) {
            try {
                collection_user.findOne({_id: parseInt(id), sessionValue: parseInt(token[1])}, function(err, item) {
                    if (item != null) {
                        if(parseInt((date - item.sessionDate)) < 300000) {
                            collection_user.update({_id: parseInt(id)}, {$set: {sessionDate: date}}, {safe: true}, function(err, result) {
                                if (err) {
                                    res.send(409, {'error': 'An error has occurred'});
                                } 
                                else {
                                    console.log('User ' + item.name + ' request accepted');
                                }
                            });
                            callback(true);
                        }
                        else {
                            res.send(408, {'error': 'Inactive time pass'});
                            callback(false);
                        }
                    }
                    else {
                        callback(false);
                    }
                });
            }
            catch (err) {

            }
        });
    }
};

exports.basicHeaders = function(req, res, callback) {
    if((req.headers['content-type'] == 'application/json')
        && (req.headers['accept'] == 'application/json')){        
        callback(true);
    }
    else {
        callback(false);
    }
};
