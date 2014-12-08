/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var CommunityModel = Backbone.Model.extend({
        defaults: {
        }
    });

    return CommunityModel;
});
