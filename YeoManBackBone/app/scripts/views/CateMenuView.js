
define([
    'jquery',
    'underscore',
    'backbone',
    'text!/scripts/templates/categories_menu.html'
], function ($, _, Backbone, menu_template) {
    'use strict';
    var CateMenuView = Backbone.View.extend({
        el: '#cate_navbar',
        template: _.template(menu_template),

    initialize: function() {
        //_.bindAll(this, 'render');
        this.render();
        //this.render();
    },

    render: function() {
        $.ajax({ 
           url: 'http://localhost:9000/category/',
           type: 'GET',
           beforeSend : function(req) {  
                          req.setRequestHeader("content-type", "application/json"); 
                          req.setRequestHeader("accept", "application/json"); 
                          },
            success: function(data) {
                var datos = { target:data };
                this.$el.html( this.template(datos) );
            }.bind(this)
        })
    }

});

    return CateMenuView;
});
