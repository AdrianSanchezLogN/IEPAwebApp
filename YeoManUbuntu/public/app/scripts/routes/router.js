/*global define*/

define([
    'jquery',
    'backbone',
    'amplify',
    'homeView',
    'loginView',
    'categoryView',
    'paypalView',
    'CateMenuView',    
    'categoriesCollection',
    'newsView',
], function ($, Backbone,amplify,homeView,loginView, categoryView, paypalView, CateMenuView, categoryCollection, newsView) {
    'use strict';

    var HomeView = new homeView(),
        LoginView = new loginView(),
        CategoryView = new categoryView(),
        PaypalView = new paypalView(),        
        CateMenuView = new CateMenuView(),
        CategoryCollection = new categoryCollection(),
        Router = Backbone.Router.extend({

        routes:{
      'login': 'showLogin',
      'home': 'showHome',
      'cat/:id': 'showCate',
      'paypal/:pay_id/:state/:total/:currency/:desc': 'showPaypal'
    },

    showCateMenu: function( ) {   
        var NewsView = new newsView();               
        var setHeader = function (req) {
            req.setRequestHeader("content-type", "application/json"); 
            req.setRequestHeader("accept", "application/json"); 
          };
        CategoryCollection.fetch({ 
          beforeSend: setHeader,
          success: function(res){
            CateMenuView.render(CategoryCollection);
          }
        });
    },

    showLogin: function( ) {
      LoginView.render();
    },

  showHome: function( ) {
      HomeView.render();
    },

  showCate: function(id) {
      CategoryView.render(CategoryCollection, id);
    },

  showPaypal: function(pay_id, state, total, currency, desc) {
      PaypalView.render(pay_id, state, total, currency, desc);
    },

  });
    return Router;
    //Backbone.history.start();
});
