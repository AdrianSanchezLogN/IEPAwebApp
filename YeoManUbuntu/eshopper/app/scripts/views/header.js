/**
 * @description Home View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!./templates/header-menu-logged.html'
], function ($, _, Backbone, template) {
    'use strict';

  /**
   * @description View Variable {Router}
   */
  var HomeView = Backbone.View.extend({

    /**
     * @description Element on the page where the View will get Rendered
     */
    el: '.header-shop-menu',
    appRouter: {},
    modalUp: false,
    manualPage: 1,
    template: _.template(template),
    carAmmount: 2,


    /**
     * @description Event Binding for the View
     */ 
    events: {


      'click .logout': 'logOut',
      'click .login_button': 'loginFunct',  
      'click .acceptModal': 'passFunct',
      'click .forget': 'modalBoolean',
      'keydown': 'keyPressed',
      'change #modalemailLogin': 'checkMail',
      'click .help-button': 'manualNext',
      'click .user_help': 'manualInit'
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
      this.delegateEvents(); 
      this.appRouter = router;
      this.$el.html(this.template);
      $('.help-button').removeClass('current-help');
      $('.button-first').addClass('current-help');
      $('.modal-backdrop').addClass('hidden');
      $('#cart_text')[0].innerHTML = this.carAmmount;
    },

    /**
     * @description Logs Out the user in the application
     * @returns {Void}
     */ 
    logOut: function() {
      try{
        var data = amplify.store('User'),
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
      amplify.store('User',null);
      this.appRouter.autologout = 0;
      this.appRouter.navigate('#', true);
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


