/*global define*/

define([
    'underscore',
    'backbone',
    'models/category'
], function (_, Backbone, CategoriesModel) {
    'use strict';

    var CategoriesCollection = Backbone.Collection.extend({
        model: CategoriesModel,
        url: 'http://localhost:9000/category/'
    });

    return CategoriesCollection;
});