/*global define*/

define([
    'underscore',
    'backbone',
    'models/craftsman'
], function (_, Backbone, CraftsmanModel) {
    'use strict';

    var CraftsmanCollection = Backbone.Collection.extend({
        model: CraftsmanModel,
        url: 'http://localhost:9000/craftsman/'
    });

    return CraftsmanCollection;
});
