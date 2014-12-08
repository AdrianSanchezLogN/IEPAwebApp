/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        amplify: {
            deps: ['jquery'],
            exports: 'amplify'
        },
        jquery_form: {
            deps: ['jquery'],
            exports: 'jquery_form'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap',
        router: '../scripts/routes/router',
        amplify: '../bower_components/amplify/lib/amplify',
        app: 'views/app',
        loginView: 'views/login',
        homeView: 'views/home',
        categoryView: 'views/category',        
        craftsmanView: 'views/craftsman',
        communityView: 'views/community',        
        materialView: 'views/material',        
        newsView: 'views/news',        
        productView: 'views/product', 
        userView: 'views/user',
        sidebarView: 'views/sidebar',
        paypalView: 'views/paypal',      
        offcanvasView: 'views/offcanvasView',
        navbarloginView: 'views/navbar_login',
        navbarView: 'views/navbar',
        categoriesCollection: 'collections/categories',
        craftsmanCollection: 'collections/craftsman',
        communityCollection: 'collections/community',
        materialCollection: 'collections/material',  
        newsCollection: 'collections/news',
        productCollection: 'collections/product',
        userCollection: 'collections/user',        
        emailCollection: 'collections/email',
        tpl: '../bower_components/ejs/ejs',
        text: '../bower_components/text/text',
        fs: '../bower_components/fs/dist/fs',
        jquery_form: '../bower_components/form/jquery.form',
        underi18n: '../bower_components/underi18n/underi18n',
        stickit: '../bower_components/stickit/backbone.stickit',
        paginator: '../bower_components/backbone.paginator/lib/backbone.paginator.min'

    }
});

require([
    'app'
], function (App) {
    new App();
});
