/*global define*/

define([
    'underscore',
    'backbone',
    'models/material'
], function (_, Backbone, MaterialModel) {
    'use strict';

    var MaterialCollection = Backbone.Collection.extend({
        model: MaterialModel,
        url: 'http://localhost:9000/material/'
    });

    return MaterialCollection;
});
