/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var HomeModel = Backbone.Model.extend({
        defaults: {
        }
    });

    return HomeModel;
});
