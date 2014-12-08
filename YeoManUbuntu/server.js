/**
* @description Module and archives used by the server
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

var template_engine = 'dust';

var express = require('express');
	login = require('./services/login');
    user = require('./services/user');
    product = require('./services/product');
    craftsman = require('./services/craftsman');
    community = require('./services/community');
    category = require('./services/category');
    material = require('./services/material');
	image = require('./services/image');
    news = require('./services/news');
    paypal = require('./services/paypal');
    mail = require('./services/mail');
    winston = require('winston');
    cronJob = require('cron').CronJob;
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use('/public', express.static(__dirname + '/eshopper/app'));
    app.use('/admin', express.static(__dirname + '/admin/app'));
    app.use(express.static(__dirname + '/public/app'));
    app.set('template_engine', template_engine);
    app.set('view engine', template_engine);
});

try {
    var configJSON = fs.readFileSync(__dirname + "/config.json");
    var config = JSON.parse(configJSON.toString());
} catch(e) {
    console.error("File config.json not found or is invalid: " + e.message);
    process.exit(1);
}
paypal.init(config);

if ( template_engine == 'dust' ) {
    var dust = require('dustjs-linkedin'),
        cons = require('consolidate');
    app.engine('dust', cons.dust);
} 


/*
Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11
Day of Week: 0-6*/
new cronJob('0 0 9 * * *', function(){
        mail.sendAuto();
        console.log('Birthday Job runned');
    }, null, true, null);


var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
  ],
  exitOnError: false
});

module.exports.logger = logger;
/**
* @description Login/out functions of the user
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

// ------------------------------------------------
// description  Validate and give a session_token to the admin login
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// returns {Int} session_token
app.post('/admin/', login.adminlogIn);

// ------------------------------------------------
// description  Logs out and deletes the session_token of the admin login
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
app.delete('/admin/', login.logOut);

// ------------------------------------------------
// description  Validate and give a session_token to the user login
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// returns {Int} session_token
app.post('/login/', login.logIn);

// ------------------------------------------------
// description  Logs out and deletes the session_token of the user login
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
app.delete('/login/', login.logOut);


/**
* @description REST functions of the user
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

// ------------------------------------------------
// description  Gets information from one or all the users
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// returns {JSON} information related to the user
// All the users http://localhost:9000/user/
// A single user http://localhost:9000/user/?id=1
app.get('/user/', user.findUser);

// ------------------------------------------------
// description Insert a new user
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {JSON} information 
// returns {JSON} information related to the user
// http://localhost:9000/user/ + JSON
app.post('/user/', user.registerUser);

// ------------------------------------------------
// description Update a user
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int, JSON} id and the information 
// returns {JSON} information related to the user
// http://localhost:9000/user/?id=2 + JSON
app.put('/user/', user.updateUser); 

// ------------------------------------------------
// description Delete a user
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// http://localhost:9000/user/?id=2
app.delete('/user/', user.deleteUser);


/**
* @description REST functions of the products
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

// ------------------------------------------------
// description Search the products information that matches some criteria
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id, category, material, crafstman - {string} keys 
// returns {JSON} information related to the product
// All the products http://localhost:9000/product/
// A single product http://localhost:9000/product/?id=1
// All the products from a category http://localhost:9000/product/?cate=1
// All the products from a craftsman http://localhost:9000/product/?craft=1
// All the products made of a material http://localhost:9000/product/?mate=1
// All the products matching a keyword  http://localhost:9000/product/?key1=Handmade&key2=Wood
app.get('/product/', product.findProduct); 

// ------------------------------------------------
// description Insert a new product
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {JSON} information 
// returns {JSON} information related to the product
// http://localhost:9000/product/ + JSON
app.post('/product/', product.addProduct); 

// ------------------------------------------------
// description Update a product
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int, JSON} id and the information 
// returns {JSON} information related to the product
// http://localhost:9000/product/?id=2 + JSON
app.put('/product/', product.updateProduct);

// ------------------------------------------------
// description Add an image to a product
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int, JSON} id and the information 
// returns {JSON} information related to the image path
// http://localhost:9000/product/?id=2 + JSON
app.put('/productImage/', product.addImageProduct);

// ------------------------------------------------
// description Removes an image from a product
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int, JSON} id and the information 
// returns {JSON} information related to the image path
// http://localhost:9000/product/?id=2 + JSON
app.put('/productImageRemove/', product.removeImageProduct);

// ------------------------------------------------
// description Delete a product
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// http://localhost:9000/product/?id=2
app.delete('/product/', product.deleteProduct);


/**
* @description REST functions of the craftsmen
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

// ------------------------------------------------
// description  Gets information from one or all the craftsmen
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// returns {JSON} information related to the craftsman
// All the crafstmen http://localhost:9000/craftsman/
// A single craftsman http://localhost:9000/craftsman/?id=1
app.get('/craftsman/', craftsman.findCraftsman);

// ------------------------------------------------
// description Insert a new craftsman
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {JSON} information 
// returns {JSON} information related to the craftsman
// http://localhost:9000/craftsman/ + JSON
app.post('/craftsman/', craftsman.addCraftsman);

// ------------------------------------------------
// description Update a craftsman
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int, JSON} id and the information 
// returns {JSON} information related to the craftsman
// http://localhost:9000/craftsman/?id=2 + JSON
app.put('/craftsman/', craftsman.updateCraftsman);

// ------------------------------------------------
// description Delete a craftsman
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// http://localhost:9000/craftsman/?id=2
app.delete('/craftsman/', craftsman.deleteCraftsman);



/**
* @description REST functions of the communities
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

// ------------------------------------------------
// description Gets information from one or all the communities
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// returns {JSON} information related to the community
// All the communities http://localhost:9000/community/
// A single community http://localhost:9000/community/?id=1
app.get('/community/', community.findCommunity);

// ------------------------------------------------
// description Insert a new community
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {JSON} information 
// returns {JSON} information related to the community
// http://localhost:9000/community/ + JSON
app.post('/community/', community.addCommunity);

// ------------------------------------------------
// description Update a community
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int, JSON} id and the information 
// returns {JSON} information related to the community
// http://localhost:9000/community/?id=2 + JSON
app.put('/community/', community.updateCommunity);

// ------------------------------------------------
// description Delete a community
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// http://localhost:9000/community/?id=2
app.delete('/community/', community.deleteCommunity);


/**
* @description REST functions of the categories
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

// ------------------------------------------------
// description Gets information from one or all the categories
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// returns {JSON} information related to the category
// All the categories http://localhost:9000/category/
// A single category http://localhost:9000/category/?id=1
app.get('/category/', category.findCategory);

// ------------------------------------------------
// description Insert a new category
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {JSON} information 
// returns {JSON} information related to the category
// http://localhost:9000/category/ + JSON
app.post('/category/', category.addCategory);

// ------------------------------------------------
// description Update a category
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int, JSON} id and the information 
// returns {JSON} information related to the category
// http://localhost:9000/category/?id=2 + JSON
app.put('/category/', category.updateCategory);

// ------------------------------------------------
// description Delete a category
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// http://localhost:9000/category/?id=2
app.delete('/category/', category.deleteCategory);


/**
* @description REST functions of the materials
* @author Adrián Sánchez <adriansanchez.logn@gmail.com>
*/

// ------------------------------------------------
// description Gets information from one or all the materials
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// returns {JSON} information related to the material
// All the material http://localhost:9000/material/
// A single material http://localhost:9000/material/?id=1
app.get('/material/', material.findMaterial);

// ------------------------------------------------
// description Insert a new material
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {JSON} information 
// returns {JSON} information related to the material
// http://localhost:9000/material/ + JSON
app.post('/material/', material.addMaterial);

// ------------------------------------------------
// description Update a material
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int, JSON} id and the information 
// returns {JSON} information related to the material
// http://localhost:9000/material/?id=2 + JSON
app.put('/material/', material.updateMaterial);

// ------------------------------------------------
// description Delete a material
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// http://localhost:9000/material/?id=2
app.delete('/material/', material.deleteMaterial);


// ------------------------------------------------
// description Gets information from one or all the news
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// returns {JSON} information related to the news
// All the news http://localhost:9000/news/
// A single news http://localhost:9000/news/?id=1
app.get('/news/', news.findNews);

// ------------------------------------------------
// description Insert a new news
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {JSON} information 
// returns {JSON} information related to the news
// http://localhost:9000/news/ + JSON
app.post('/news/', news.addNews);

// ------------------------------------------------
// description Update a news
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int, JSON} id and the information 
// returns {JSON} information related to the news
// http://localhost:9000/news/?id=2 + JSON
app.put('/news/', news.updateNews);

// ------------------------------------------------
// description Delete news
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param {Int} id 
// http://localhost:9000/news/?id=2
app.delete('/news/', news.deleteNews);

// ------------------------------------------------
// description Insert a new image
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param submit form
// http://localhost:9000/category/ + JSON
app.post('/image/', image.addImage);



// ------------------------------------------------
// description Insert a new image
// author Adrián Sánchez <adriansanchez.logn@gmail.com>
// param submit form
// http://localhost:9000/category/ + JSON
app.post('/paypal/', paypal.makePayment);
app.get('/orderExecute', paypal.orderExecute);

app.get('/email/', mail.findEmail);

app.post('/email/', mail.sendPass);



app.get('*', function (req, res) {
    res.redirect('../#home', 404);
});

// Listening port
app.listen(9000);
console.log('Listening on port 9000...');
