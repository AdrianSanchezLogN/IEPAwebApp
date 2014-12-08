/**
 * @description Slider View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'newsCollection',
    'text!./templates/slider.html'
], function ($, _, Backbone, newsCollection, template) {
    'use strict';

  /**
   * @description View Variable {Router}
   */
  var NewsCollection = new newsCollection(),

  SliderView = Backbone.View.extend({

    /**
     * @description Element on the page where the View will get Rendered
     */
    el: '#slider_div',
    appRouter: {},
    manualPage: 1,
    haventClick : true,
    template: _.template(template),

    /**
     * @description Event Binding for the View
     */ 
    events: {
      'click #control-carousel': 'clickNext'
    },

    /**
     * @description Backbone View Constructor
     * @returns {Void}
     */
    initialize: function( ) {
      this.$el.html();
    },

    /**
     * @description Renders the View
     * @param {Object} Router
     * @returns {Void}
     */  
    render: function(router) {      
      this.newsFetch();
      this.appRouter = router;
    },

    renderMain: function() {
      this.delegateEvents();       
      this.$el.html('').hide().fadeIn().slideDown('slow');            
      this.$el.append(this.template(NewsCollection));
      this.haventClick = true;
     // setTimeout(this.nextSlide, 5000, this);
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
        data: $.param({ skip: -1}),
        beforeSend: setHeader,
        success: function(res){
          this.renderMain();
        }.bind(this)
      });
    },

    nextSlide: function(that) {
      if(that.haventClick){
        $( '#slider-carousel .right' ).trigger('click');
        setTimeout(that.nextSlide, 5000, that);
      }
    },

    clickNext: function() {
      this.haventClick = false;
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

  return SliderView;
});


