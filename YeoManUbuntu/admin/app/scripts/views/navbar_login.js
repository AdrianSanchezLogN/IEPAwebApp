/**
 * @description Navbar View when the user hasn't log in yet
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!./templates/navbar_login.html'
], function ($, _, Backbone, navbar_template) {
    'use strict';

  var NavbarLoginView = Backbone.View.extend({

    /**
    * @description Element on the page where the View will get Rendered
    */
    el: '#navbar',
    navbar_template: _.template(navbar_template),

    /**
     * @description Event Binding for the View
     */ 
    events: {
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
     * @returns {Void}
     */ 
    render: function() {
        this.$el.html(this.navbar_template());
    },

    /**
     * @description Cleans the DOM
     * @returns {Void}
     */ 
    clear: function() {
      this.$el.empty();
    }

  });

  return NavbarLoginView;
});
