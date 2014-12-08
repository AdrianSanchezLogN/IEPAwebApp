
define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'CateMenuView'
], function ($, _, Backbone, Router, CateMenuView) {
    'use strict';
    var time = new Date(),
        AppView = Backbone.View.extend({
        
        initialize: function() {
        	new CateMenuView();
        	new Router();
        	Backbone.history.start();
        }
    });

    amplify.store("User",null);

    return AppView;
});
