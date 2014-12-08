/*global define*/

define([
    'jquery',
    'backbone',
    'amplify',
    'homeView',
    'loginView'
], function ($, Backbone,amplify,homeView,loginView) {
    'use strict';

    var HomeView = new homeView(),
        LoginView = new loginView(),
        Router = Backbone.Router.extend({

        routes:{
      'login': 'showLogin',
      'home': 'showHome',
    },

    showLogin: function( ) {
      LoginView.render();
    },

  showHome: function( ) {
      HomeView.render();
    },

  });
    return Router;
    //Backbone.history.start();
});
