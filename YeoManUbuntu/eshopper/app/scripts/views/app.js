/**
 * @description App View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'router'
], function ($, _, Backbone, Router) {
    'use strict';
    var time = new Date(),
        AppView = Backbone.View.extend({
        
        /**
         * @description Backbone View Constructor
         * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
         * @returns {Void}
         */
        initialize: function() {
            var router = new Router();
            Backbone.history.start();
        }
    });
    return AppView;
});
