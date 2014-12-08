/**
 * @description Navbar View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!./templates/navbar.html'
], function ($, _, Backbone, navbar_template) {
    'use strict';

  /**
   * @description View Variable {Router}
   */
  var NavbarView = Backbone.View.extend({
    
    /**
     * @description Element on the page where the View will get Rendered
     */
    el: '#navbar',
    appRouter: {},

    /**
     * @description Template used in the View
     */
    navbar_template: _.template(navbar_template),

    /**
     * @description Event Binding for the View
     */ 
    events: {            
      'click .logout': 'logOut',
      'mouseenter .container': 'mousemove',      
      'mouseleave .container': 'mousemove', 
    },

    /**
     * @description Backbone View Constructor
     * @returns {Void}
     */
    initialize: function() {
      this.$el.html();
    },

    /**
     * @description Renders the View
     * @param {Object} Router
     * @returns {Void}
     */ 
    render: function(router) { 
      this.delegateEvents(); 
      this.appRouter = router;
      this.$el.html(this.navbar_template());
    },
      
    /**
     * @description Logs Out the user in the application
     * @returns {Void}
     */ 
    logOut: function() {
      try{
        var data = amplify.store('Admin'),
          url = 'http://localhost:9000/login/?id=' + data["id"];
        $.ajax({ 
          url: url,
          type: 'DELETE',
          data: JSON.stringify({
          }),
          beforeSend : function(req) { 
            req.setRequestHeader('content-type', 'application/json'); 
            req.setRequestHeader('accept', 'application/json'); 
          },
        });
      }
      catch (err) {}
      amplify.store('Admin',null);
      this.appRouter.autologout = 0;
      this.appRouter.navigate('#login', true);
    },

    /**
     * @description Set the new time in for the autologout function
     * @returns {Void}
     */ 
    mousemove: function() {
      this.appRouter.time = new Date();
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

  return NavbarView;
});
