
define([
    'jquery',
    'underscore',
    'backbone',
    'newsCollection',
    'text!./templates/news.html'
], function ($, _, Backbone, newsCollection, menu_template) {
    'use strict';
    var NewsCollection = new newsCollection(),
        NewsView = Backbone.View.extend({
        el: '#news_navbar',
        template: _.template(menu_template),

    initialize: function() {
        this.newsFetch();
    },

    render: function() {
      this.$el.html('');
      NewsCollection.each(function(category){
        this.$el.append(this.template(category.attributes));
      }.bind(this))
    },

    /**
     * @description Fetch the Categories in the database to the Collection
     * @returns {Void}
     */ 
    newsFetch: function() {
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      NewsCollection.fetch({
        beforeSend: setHeader,
        success: function(res){
          this.render();
        }.bind(this)
      });
    },

  });
    return NewsView;
});
