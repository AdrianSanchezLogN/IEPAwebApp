var nodemailer = require("nodemailer");
	cronJob = require('cron').CronJob;
	mongo = require('mongodb');
    _ = require('underscore');
    headers = require('./headers');
    logger = require('../server');
    crypto = require('crypto');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('IEPA_Database', server);
 
db.open(function(err, db) {
    if(!err) {
        logger.logger.info('Connected to "IEPA_Database" database');
        console.log('Connected to "IEPA_Database" database');
    }
    else{
        console.log(404, 'Error Connecting to "IEPA_Database" database');
    }
});

var smtpTransport = nodemailer.createTransport('SMTP',{
   service: 'Gmail',  // sets automatically host, port and connection security settings
   auth: {
       user: 'adriansanchez.logn@gmail.com',
       pass: '09aDmAsAsE01'
   }
});

/**
* @description Gets information from one or all the emails
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
* @param {req, res} request (with the id) send to the server and the response return by the server
* @returns {JSON} information related to the email
*/
exports.findEmail = function(req, res) {
    headers.basicHeaders(req, res, function(callback){
        if(callback) {
            var id = req.query.id;
            if (! isNaN(id)) {
                console.log('Returning email: ' + id);
                db.collection('email', function(err, collection_email) {
                    try {
                        collection_email.findOne({_id: parseInt(id)}, function(err, item) {
                            res.send(200, item);
                        });
                    }
                    catch (err){
                        res.send(409, err);
                    }
                });
            }
            else if(typeof(id) == 'undefined') {
                console.log('Returning all emails');
                db.collection('email', function(err, collection_email) {
                    collection_email.find().toArray(function(err, items) {
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

exports.sendPass = function(req, res) {
	headers.basicHeaders(req, res, function(callback){
    if(callback) {
      var email = req.body['email'];
      db.collection('email', function(err, collection_email) {
        try {
            collection_email.findOne({email: email}, function(err, item) {
                if(item != null){
                    db.collection('user', function(err, collection_user) {
                        collection_user.findOne({email: item._id}, function(err, items){
                            if(items != null){
                              var decryptedPassword = items.password.toString('utf8');
                              var to = items.name + '<' + item.email + '>', // receiver
                                 subject = 'IEPA: Recuperación de la Contraseña', // subject
                                 text = 'Buen día ' + items.name + '. \n\n\nEste es un correo de recuperación de contraseña solicitado en el sitio http://www.artesaniaindigenacr.com/. \n\nSu contraseña es: ' + decryptedPassword + '\n\nLe agradecemos su preferencia en nuestro servicio.\n\n\nIEPA - Artesanias Indígenas.'; // body
                              smtpTransport.sendMail({  //email options
                                 to: to, // receiver
                                 subject: subject, // subject
                                 text: text// body
                                }, function(error, response){  //callback
                                 if(error){
                                     console.log(error);
                                     res.send(409, {'error': 'Mail Not Send'});
                                 }else{
                                     console.log("Message sent: " + response.message);
                                     res.send(200, {'info': 'Recovery Mail Sent Successfully'});
                                 }
                                 
                                 smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                              });
                            }
                            else {
                                res.send(409, {'error': 'Email not found'});
                            }
                        })
                    });
                }
                else {
                    res.send(409, {'error': 'Email not found'});
                }
            });
        }
        catch (err){
            res.send(409, err);
        }
      }); 
  	}
    else {
        res.send(401, {'error':'Authorization failed'});
    }
  });
}

exports.sendAuto = function() {
    var today_day = new Date().getDate(),
        today_month = new Date().getMonth(),
        today_hour = new Date().getHours();
    console.log(today_day + ' - ' + today_month + ' - ' + today_hour);
	db.collection('user', function(err, collection_user) {
        collection_user.aggregate({ $match: { birthday: { $exists: true } } },{$project: {name: 1, email:1, month: {$month: '$birthday'}, day: {$dayOfMonth: '$birthday'}}}, {$match: {month: today_month, day: today_day}}, function(err, items) {
            _.each(items, function(i) { 
                db.collection('email', function(err, collection_email) {
                    collection_email.findOne({_id: parseInt(i.email)}, function(err, item) {
                        console.log(item);
                        var subject = 'IEPA: Feliz Cumpleaños ' + i.name,
                            to = 'Cumpleañero <' + item.email + '>',
                            text = 'Feliz Cumpleaños estimado(a) ' + i.name + ' de parte de IEPA Artesanias Indigenas le deseamos un feliz día y muchas bendiciones en este día tan especial.'
                        smtpTransport.sendMail({  //email options
                           to: to, // receiver
                           subject: subject, // subject
                           text: text // body
                        }, function(error, response){  //callback
                           if(error){
                               console.log(error);
                               //res.send(409, {'error': 'Mail not send'});
                           }else{
                               console.log('Message sent: ' + response.message);
                               logger.logger.info('Message sent: ' + response.message);
                               //res.send(200, {'info': 'Mail Sent'});
                           }    
                        }); 
                    }); 
                });
            });
        }); 
    }); 
}
