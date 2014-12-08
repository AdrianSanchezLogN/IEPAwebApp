
define([
    'jquery',
    'underscore',
    'backbone',
    'text!./templates/categories_menu.html'
], function ($, _, Backbone, menu_template) {
    'use strict';
    var CateMenuView = Backbone.View.extend({
        el: '#cate_navbar',
        template: _.template(menu_template),

    initialize: function() {
        
    },

    render: function(CategoryCollection) {
      CategoryCollection.each(function(category){
        var data = {target: {attributes: category.attributes}};
        this.$el.append(this.template(data));
      }.bind(this))
    }

  });
    return CateMenuView;
});
