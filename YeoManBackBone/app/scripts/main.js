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
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap',
        router: '../scripts/routes/router',
        amplify: '../bower_components/amplify/amplify',
        loginView: 'views/login',
        homeView: 'views/home',
        CateMenuView: 'views/CateMenuView',
        tpl: '../bower_components/ejs/ejs',
        text: '../bower_components/text-master/text',

    }
});

require([
    'views/app'
], function (App) {
    new App();
});
