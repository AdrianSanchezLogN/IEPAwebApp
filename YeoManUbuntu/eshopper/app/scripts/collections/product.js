/*global define*/

define([
    'underscore',
    'backbone',
    'models/product'
], function (_, Backbone, ProductModel) {
    'use strict';

    var ProductCollection = Backbone.Collection.extend({
        model: ProductModel,
        url: 'http://localhost:9000/product/'
    });

    return ProductCollection;
});