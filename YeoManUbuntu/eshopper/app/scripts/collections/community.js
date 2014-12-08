/*global define*/

define([
    'underscore',
    'backbone',
    'models/community'
], function (_, Backbone, CommunityModel) {
    'use strict';

    var CommunityCollection = Backbone.Collection.extend({
        model: CommunityModel,
        url: 'http://localhost:9000/community/'
    });

    return CommunityCollection;
});
