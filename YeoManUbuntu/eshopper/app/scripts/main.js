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
        tpl: '../bower_components/ejs/ejs',
        text: '../bower_components/text/text',
        fs: '../bower_components/fs/dist/fs',
        jquery_form: '../bower_components/form/jquery.form',
        underi18n: '../bower_components/underi18n/underi18n',
        stickit: '../bower_components/stickit/backbone.stickit',
        paginator: '../bower_components/backbone.paginator/lib/backbone.paginator.min',
        
        //Views
        headerView: 'views/login',
        sliderView: 'views/slider',
        sidebarView: 'views/sidebar',
        homeView: 'views/home',
        productView: 'views/product',

        //Collections
        categoriesCollection: 'collections/categories',        
        newsCollection: 'collections/news',        
        productCollection: 'collections/product',
        craftsmanCollection: 'collections/craftsman',
        materialCollection: 'collections/material',
        communityCollection: 'collections/community',

    }
});

require([
    'app'
], function (App) {
    new App();
});
