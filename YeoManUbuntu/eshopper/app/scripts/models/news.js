/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var NewsModel = Backbone.Model.extend({
        defaults: {
        }
    });

    return NewsModel;
});
