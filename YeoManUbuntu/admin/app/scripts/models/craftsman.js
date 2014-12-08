/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var CraftsmanModel = Backbone.Model.extend({
        defaults: {
        }
    });

    return CraftsmanModel;
});
