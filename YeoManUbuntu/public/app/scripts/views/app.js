
define([
    'jquery',
    'underscore',
    'backbone',
    'router'
], function ($, _, Backbone, Router) {
    'use strict';
    var value;
    var time = new Date(),
        AppView = Backbone.View.extend({
        
        initialize: function() {
        	var router = new Router();
        	Backbone.history.start();
            router.showCateMenu();
        }
    });

    //amplify.store("User",null);

    return AppView;
});
