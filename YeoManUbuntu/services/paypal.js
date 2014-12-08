	/**
* @description Functions used by category services
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

var mongo = require('mongodb');
    headers = require('./headers');
    paypal_sdk = require('paypal-rest-sdk');
    uuid = require('node-uuid');
 
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
exports.makePayment = function(req, res) {
    headers.basicHeaders(req, res, function(callback){
        if(callback) {
        	var order_id = uuid.v4(),
        		data = {'amount' : req.query.order_amount, 'desc' : "Prueba"},
        		paypalPayment = {
		        "intent": "sale",
		        "payer": {
		            "payment_method": "paypal",
		        },
		        "redirect_urls": {},
		        "transactions": [{
			        "amount": {
				        "currency": "USD"
			        }
		        }]
		    };

		    paypalPayment.transactions[0].amount.total = req.query.order_amount;
		    paypalPayment.redirect_urls.return_url = "http://localhost:9000/orderExecute?order_id=" + order_id;
		    paypalPayment.redirect_urls.cancel_url = "http://localhost:9000/?status=cancel&order_id" + order_id;
		    paypalPayment.transactions[0].description = req.query.desc;
		    paypal_sdk.payment.create(paypalPayment, {}, function (err, resp) {
			    if (err) {
			    	console.log(err);
			        res.send(409, {'error': 'An error creating the paypal has occurred'});
			    }

				if (resp) {
					var paypal = {};
					db.collection('id', function(err, collection_id) {
                		collection_id.find({},{paypal: 1, _id: 0}).toArray(function(err, items) {
							db.collection('paypal', function(err, collection_paypal) {
		                        paypal['_id'] = parseInt(items[0].paypal);
		                        paypal['payment_id'] = resp.id;
		                        paypal['order_id'] = order_id;
		                        collection_paypal.insert(paypal, {safe: true}, function(err, result) {
		                            if (err) {
		                                res.send(409, {'error': 'An error inserting the paypal has occurred'});
		                            } else {
		                                collection_id.update({_id: 1}, {$inc: {'paypal': 1}}, {safe: true}, function(err, result) {
		                                    if (err) {
		                                        console.log('Error updating id: ' + err);
		                                        res.send(409, {'error': 'An error updating the id has occurred'});
		                                    } 
		                                    else {
		                                        console.log('' + result + ' document(s) updated');
		                                        var link = resp.links;
												for (var i = 0; i < link.length; i++) {
													if (link[i].rel === 'approval_url') {
														console.log(link[i]);
														res.send(200, link[i].href);
													}
												}
		                                    }
		                                });
		                            }
		                        });
		                    });
						});
            		});
				}
			});
		}
        else {
            res.send(401, {'error':'Authorization failed'});
        }
    });
};

exports.orderExecute = function (req, res) {
    var payer = { payer_id : req.query.PayerID };
    db.collection('paypal', function(err, collection_paypal) {
	    try {
	        collection_paypal.findOne({order_id: req.query.order_id}, function(err, item) {
	            console.log(item.order_id);
	            paypal_sdk.payment.execute(item.payment_id, payer, {}, function (err, resp) {
			        if (err) {
			            console.log(err);
						//res.render('order_detail', { message: [{desc: "execute payment API failed", type: "error"}]});
			        }
			        if (resp) {
			        	var url = '/#paypal/pay_id='+resp.id+'/state='+resp.state+'/total='+resp.transactions[0].amount.total+'/currency='+resp.transactions[0].amount.currency+'/desc='+resp.transactions[0].description;
			        	console.log(resp.id);
			        	console.log(resp.state);
			        	console.log(resp.payer.payer_info.email);
			        	console.log(resp.transactions[0].amount);
			        	console.log(resp.transactions[0].description);
			            res.redirect(url);
			        }
			    });
	        });
	    }
	    catch (err){
	        res.send(409, err);
	    }
	});
};

exports.init = function (c) {
	config = c;
	paypal_sdk.configure(c.api);
	//db.configure(c.mongo);
};