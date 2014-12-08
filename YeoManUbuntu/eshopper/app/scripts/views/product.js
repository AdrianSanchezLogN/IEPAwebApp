/**
 * @description Category View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'productCollection',
    'categoriesCollection',
    'text!./templates/product.html'
], function ($, _, Backbone, productCollection, categoryCollection, template) {
    'use strict';

  /**
   * @description View Variable {Router}
   */
  var ProductCollection = new productCollection(),
    CategoryCollection = new categoryCollection(),

  HomeView = Backbone.View.extend({

    /**
     * @description Element on the page where the View will get Rendered
     */
    el: '#main',
    appRouter: {},
    manualPage: 1,
    template: _.template(template),

    /**
     * @description Event Binding for the View
     */ 
    events: {
      'click .glyphicon_products': 'productDetails',
      'click .add-to-cart': 'productCart'
    },

    /**
     * @description Backbone View Constructor
     * @returns {Void}
     */
    initialize: function( ) {
      this.$el.html('');
    },

    /**
     * @description Renders the View
     * @param {Object} Router
     * @returns {Void}
     */  
    render: function(prod_id) { 
      this.productsFetch(prod_id);
    },

    renderMain: function() {
      this.delegateEvents(); 
      this.$el.html(''); 
      ProductCollection['Category'] = CategoryCollection; 
      this.$el.append(this.template(ProductCollection));
    },

    /**
     * @description Fetch the Products in the database to the Collection
     * @returns {Void}
     */ 
    productsFetch: function(prod_id) {
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      ProductCollection.fetch({
        data: $.param({id: prod_id}),
        beforeSend: setHeader,
        success: function(res){
          this.categoriesFetch();
        }.bind(this)
      });
    },

    /**
     * @description Fetch the Categories in the database to the Collection
     * @returns {Void}
     */ 
    categoriesFetch: function() {
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      CategoryCollection.fetch({
        data: $.param({skip: -1}),
        beforeSend: setHeader,
        success: function(res){
          this.renderMain();
        }.bind(this)
      });
    },

    productDetails: function(e) {
    },

    productCart: function(e) {      
    },

    /**
     * @description Cleans the DOM and stop listen to the events of the View
     * @returns {Void}
     */ 
    clear: function() {
      this.$el.empty();
      this.undelegateEvents();
    }
  });

  return HomeView;
});


