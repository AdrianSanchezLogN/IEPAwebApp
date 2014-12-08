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
        loginView: 'views/login',
        homeView: 'views/home',
        categoryView: 'views/category',
        newsView: 'views/news',
        paypalView: 'views/paypal',
        categoriesCollection: 'collections/categories',
        newsCollection: 'collections/news',
        CateMenuView: 'views/CateMenuView',
        tpl: '../bower_components/ejs/ejs',
        text: '../bower_components/text/text',
		fs: '../bower_components/fs/dist/fs',
        jquery_form: '../bower_components/form/jquery.form',
        underi18n: '../bower_components/underi18n/underi18n'

    }
});

require([
    'views/app'
], function (App) {
    new App();
});
