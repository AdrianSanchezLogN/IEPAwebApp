/**
 * @description Home View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'productCollection',
    'categoriesCollection',
    'craftsmanCollection',
    'materialCollection',
    'text!./templates/home.html',
    'text!./templates/searchResult.html',
    'text!./templates/templateLoading.html',
    'text!./templates/product.html'
], function ($, _, Backbone, productCollection, categoryCollection, craftsmanCollection, materialCollection, mainTemplate, searchResult, templateLoading, templateProduct) {
    'use strict';

  /**
   * @description View Variable {Collection, EventBus}
   */
  var ProductCollection = new productCollection(),
  CategoryCollection = new categoryCollection(),
  CraftsmanCollection = new craftsmanCollection(),
  MaterialCollection = new materialCollection(),
  EventBus = {},

  HomeView = Backbone.View.extend({

    /**
     * @description Element on the page where the View will get Rendered
     */
    el: '#main',
    appRouter: {},
    manualPage: 1,
    mainTemplate: _.template(mainTemplate),
    searchResult: _.template(searchResult),
    templateProduct: _.template(templateProduct),

    /**
     * @description Event Binding for the View
     */ 
    events: {
      'click .glyphicon_products': 'productDetails',
      'click .add-to-cart': 'productCart',
      'click #search_trigger': 'productSearch',
      'mouseenter .small-image': 'changeImage',
      'change .quantitySelect': 'validateQuantity'
    },

    /**
     * @description Backbone View Constructor
     * @returns {Void}
     */
    initialize: function(eventBus) {
      this.$el.html('');
      EventBus = eventBus;
      EventBus.on('product:search', function (param) {
        this.productSearch(param);
      }.bind(this)); 
    },

    /**
     * @description Renders the View
     * @param {Object} Router
     * @returns {Void}
     */  
    render: function(router) {      
      this.productsFetch();
      this.appRouter = router;
    },

    renderMain: function(param) {      
      this.delegateEvents();       
      this.$el.html('').hide().fadeIn().slideDown('slow'); 
      if (typeof(param) == 'undefined'){        
        this.$el.append(this.mainTemplate(ProductCollection));
      }
      else {
        if(ProductCollection.size()==0){
          this.$el.append('<div class="col-sm-9 padding-right"><div class="features_items"><!--features_items--><h2 class="title text-center">Ningún Producto Encontrado</h2></div><!--features_items--><a class="hidden" id="search_trigger"/></div>');
        }
        else{
          this.$el.append(this.searchResult(ProductCollection));
        }
      }       
    },

    renderProduct: function(prod_id) { 
      this.productsFetch(prod_id);
    },

    renderProductMain: function() {
      this.delegateEvents(); 
      this.$el.html(''); 
      ProductCollection['Category'] = CategoryCollection; 
      ProductCollection['Craftsman'] = CraftsmanCollection; 
      ProductCollection['Material'] = MaterialCollection; 
      this.$el.append(this.templateProduct(ProductCollection));
    },

    /**
     * @description Fetch the Categories in the database to the Collection
     * @returns {Void}
     */ 
    productsFetch: function(prod_id) {
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      if (typeof(prod_id) == 'undefined'){
        ProductCollection.fetch({
          data: $.param({ skip: -1}),
          beforeSend: setHeader,
          success: function(res){
            this.renderMain();
          }.bind(this)
        });
      }
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
          this.craftsmanFetch();
        }.bind(this)
      });
    },

    /**
     * @description Fetch the Craftsmen in the database to the Collection
     * @returns {Void}
     */ 
    craftsmanFetch: function() {
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      CraftsmanCollection.fetch({
        data: $.param({skip: -1}),
        beforeSend: setHeader,
        success: function(res){
          this.materialFetch();
        }.bind(this)
      });
    },

    /**
     * @description Fetch the Materials in the database to the Collection
     * @returns {Void}
     */ 
    materialFetch: function() {
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      MaterialCollection.fetch({
        data: $.param({skip: -1}),
        beforeSend: setHeader,
        success: function(res){
          this.renderProductMain();
        }.bind(this)
      });
    },

    productDetails: function(e) {
      this.appRouter.navigate('#prod/id='+e.currentTarget.value, true);
    },

    productCart: function(e) {
      var msgId = '#msgAdded_' + e.currentTarget.value,
        param = {'item': e.currentTarget.value, 'quantity':1, 'msg': msgId};
      if(typeof($('.quantitySelect')[0]) != 'undefined'){
        param.quantity = $('.quantitySelect')[0].selectedIndex+1;
      } 
      EventBus.trigger('add:cart', param);
    },

    productSearch: function(param){
      this.$el.html(templateLoading);
      var num = 1,
        categories = {};
      param.categories.forEach(function(i){
        categories['cate'+num] = i;
        num++;
      })
      num = 1;
      param.keywords.split(' ').forEach(function(i){
        categories['key'+num] = i;
        num++;
      })
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      ProductCollection.fetch({
        data: $.param(categories),
        beforeSend: setHeader,
        success: function(res){
          this.renderMain({categories: param.models, keywords: param.keywords.split(' ')});
        }.bind(this)
      });
    },

    changeImage: function(e) {
      $('#product-image').attr('src', e.currentTarget.src);
    },

    validateQuantity: function(e) {
      console.log(e.currentTarget.selectedIndex+1);
    },

    addHidden: function(idMsg) {
      $(idMsg).addClass('hidden');
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