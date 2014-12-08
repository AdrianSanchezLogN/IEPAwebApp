/**
 * @description Sidebar View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'categoriesCollection',
    'text!./templates/sidebar.html'
], function ($, _, Backbone, categoryCollection, template) {
    'use strict';

  /**
   * @description View Variable {Router}
   */
  var CategoryCollection = new categoryCollection(),
    EventBus = {},

    SidebarView = Backbone.View.extend({

    /**
     * @description Element on the page where the View will get Rendered
     */
    el: '#sidebar_div',
    appRouter: {},
    manualPage: 1,
    categoriesCheck: [],
    template: _.template(template),

    /**
     * @description Event Binding for the View
     */ 
    events: {      
      'click #search-button': 'productSearch',
      'change .category-sidebar': 'addCategory',
      'click #checkall-button': 'selectAll',
      'click #uncheckall-button': 'deselectAll'
    },

    /**
     * @description Backbone View Constructor
     * @returns {Void}
     */
    initialize: function(eventBus) {
      this.$el.html();
      EventBus = eventBus;
    },

    /**
     * @description Renders the View
     * @param {Object} Router
     * @returns {Void}
     */  
    render: function(router) {
      this.categoriesCheck = [];
      this.appRouter = router;
      this.categoryFetch();
    },

    renderMain : function() {
      this.undelegateEvents();
      this.$el.html('').hide().fadeIn().slideDown('slow');      
      this.$el.append(this.template(CategoryCollection));
      this.delegateEvents();
    },

    /**
     * @description Fetch the Categories in the database to the Collection
     * @returns {Void}
     */ 
    categoryFetch: function() {
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      CategoryCollection.fetch({
        data: $.param({ skip: -1}),
        beforeSend: setHeader,
        success: function(res){
          this.renderMain();
        }.bind(this)
      });
    },

    addCategory: function(e) {
      if(e.currentTarget.checked){
        this.categoriesCheck.splice(0,0,parseInt(e.currentTarget.value));
        if(CategoryCollection.size() == this.categoriesCheck.length){
          $('#uncheckall-button').removeClass('hidden');
          $('#checkall-button').addClass('hidden');
        }
      }
      else{
        var place = this.categoriesCheck.indexOf(e.currentTarget.value);
        this.categoriesCheck.splice(place, 1);
        $('#uncheckall-button').addClass('hidden');
        $('#checkall-button').removeClass('hidden');
      }
    },

    productSearch: function() {      
      Backbone.history.navigate('#');  
      EventBus.trigger('product:search', {'categories': this.categoriesCheck, 'keywords': $( '#input_search' ).val(), 'models':CategoryCollection.models});
    },

    selectAll: function() {
      $('.category-products input[type="checkbox"]').prop('checked', true);
      this.categoriesCheck = [];
      CategoryCollection.each(function(item){
        this.categoriesCheck.splice(0,0,parseInt(item.attributes._id));
      }.bind(this));
      $('#uncheckall-button').removeClass('hidden');
      $('#checkall-button').addClass('hidden');
    },

    deselectAll: function() {
      $('.category-products input[type="checkbox"]').prop('checked', false);
      this.categoriesCheck = [];
      $('#uncheckall-button').addClass('hidden');
      $('#checkall-button').removeClass('hidden');
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

  return SidebarView;
});


