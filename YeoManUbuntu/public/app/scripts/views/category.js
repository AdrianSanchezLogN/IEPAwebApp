var app = app || {};

define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'text!./templates/category.html',
    'underi18n',
    'text!./lang/es.json',
    'text!./lang/en.json'
], function ($, _, Backbone, Router, templateCategory, underi18n,es_text, en_text) {
    'use strict';
    var es_json = eval('(' + es_text + ')'),
        en_json = eval('(' + en_text + ')'),
        

  CategoryView = Backbone.View.extend({
      el: '#content',
      template: _.template(templateCategory),
    //t_el = underi18n.MessageFactory(test_el);
      events: {
          'click .eng': 'setEng',
          'click .esp': 'setEsp'
      },

      initialize: function() {

      },

      render: function(CategoryCollection, id) {
        CategoryCollection.each(function(category){
          if(category.attributes._id == parseInt(id.split('=')[1])){
            //var data = {category.attributes};
            console.log(category.attributes);
            //var data = {target: {attributes: category.attributes}};
          this.$el.html(this.template(category.attributes));
          }
          //var data = {target: {attributes: category.attributes}};
          //this.$el.append(this.template(data));
        }.bind(this))
      },

      setEng: function() {
        var id = 'id=' + Backbone.history.fragment.split('=')[1];
        amplify.store('lang', 'en');
        this.render(id);
        
      },

      setEsp: function() {
        var id = 'id=' + Backbone.history.fragment.split('=')[1];
        amplify.store('lang', 'es');
        this.render(id);
      },

  });
    return CategoryView;
})

