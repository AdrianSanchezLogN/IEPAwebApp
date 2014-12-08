/*global define*/

define([
    'underscore',
    'backbone',
    'models/news'
], function (_, Backbone, NewsModel) {
    'use strict';

    var NewsCollection = Backbone.Collection.extend({
        model: NewsModel,
        url: 'http://localhost:9000/news/'
    });

    return NewsCollection;
});