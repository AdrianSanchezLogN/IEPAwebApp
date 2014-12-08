/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var MaterialModel = Backbone.Model.extend({
        defaults: {
        }
    });

    return MaterialModel;
});
