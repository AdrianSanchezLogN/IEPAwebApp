define([
    'jquery',
    'backbone',
    'amplify',
    'homeView',
    'loginView',
    'offcanvasView',    
    'sidebarView',
    'navbarloginView',
    'navbarView'
], function ($, Backbone, amplify, homeView,loginView, offcanvasView, sidebarView, navbarloginView, navbarView) {
    'use strict';

    var time = new Date(),
        autologout = 0,
        HomeView = new homeView(),
        LoginView = new loginView(),    
        OffcanvasView = new offcanvasView(),
        SidebarView = new sidebarView(),
        NavbarloginView = new navbarloginView(),
        NavbarView = new navbarView(),
        Router = Backbone.Router.extend({

    routes:{
      'login': 'showLogin',
      'home': 'showHome',
      'category': 'showCategory',
      'craftsman': 'showCraftsman',
      'community': 'showCommunity',
      'material': 'showMaterial',
      'news': 'showNews',
      'product': 'showProduct',      
      'user': 'showUser',
      '': 'showLogin'
    },

    showCategory: function() { 
      var data = amplify.store('Admin');
      if (typeof(data) != "undefined"){
        var user = data['User'];             
        HomeView.render(this);
        NavbarView.render(this);
        OffcanvasView.render();       
        $('.navbar-group-item').removeClass('active');
        $('.navbar-group-item-category').addClass('active');
        SidebarView.Fetch('cat', this);
        time = new Date();
      }
      else {
        this.navigate('#login', true);
      }            
    },

    showCraftsman: function( ) { 
      var data = amplify.store('Admin');
      if (typeof(data) != "undefined"){
        var user = data['User'];  
        HomeView.render(this);
        NavbarView.render(this);
        OffcanvasView.render();      
        $('.navbar-group-item').removeClass('active');
        $('.navbar-group-item-craftsman').addClass('active');
        SidebarView.Fetch('craft', this);
        time = new Date();
      }
      else {
        this.navigate('#login', true);
      }            
    },

    showCommunity: function( ) { 
      var data = amplify.store('Admin');
      if (typeof(data) != "undefined"){
        var user = data['User']; 
        HomeView.render(this);
        NavbarView.render(this);
        OffcanvasView.render();       
        $('.navbar-group-item').removeClass('active');
        $('.navbar-group-item-community').addClass('active');
        SidebarView.Fetch('comm', this);
        time = new Date();
      }
      else {
        this.navigate('#login', true);
      }            
    },

    showMaterial: function( ) { 
      var data = amplify.store('Admin');
      if (typeof(data) != "undefined"){
        var user = data['User']; 
        HomeView.render(this);
        NavbarView.render(this);
        OffcanvasView.render();       
        $('.navbar-group-item').removeClass('active');
        $('.navbar-group-item-material').addClass('active');
        SidebarView.Fetch('mat', this);
        time = new Date();
      }
      else {
        this.navigate('#login', true);
      }            
    },

    showNews: function( ) { 
      var data = amplify.store('Admin');
      if (typeof(data) != "undefined"){
        var user = data['User']; 
        HomeView.render(this);
        NavbarView.render(this);
        OffcanvasView.render();       
        $('.navbar-group-item').removeClass('active');
        $('.navbar-group-item-news').addClass('active');
        SidebarView.Fetch('news', this);
        time = new Date();
      }
      else {
        this.navigate('#login', true);
      }            
    },

    showProduct: function( ) { 
      var data = amplify.store('Admin');
      if (typeof(data) != "undefined"){
        var user = data['User']; 
        HomeView.render(this);
        NavbarView.render(this);
        OffcanvasView.render();      
        $('.navbar-group-item').removeClass('active');
        $('.navbar-group-item-product').addClass('active');
        SidebarView.Fetch('prod', this);
        time = new Date();
      }
      else {
        this.navigate('#login', true);
      }            
    },

    showUser: function( ) { 
      var data = amplify.store('Admin');
      if (typeof(data) != "undefined"){
        var user = data['User']; 
        HomeView.render(this);
        NavbarView.render(this);
        OffcanvasView.render();       
        $('.navbar-group-item').removeClass('active');
        $('.navbar-group-item-user').addClass('active');
        SidebarView.Fetch('user', this);
        time = new Date();
      }
      else {
        this.navigate('#login', true);
      }            
    },

    showLogin: function( ) {
      $('.backdrop').removeClass('modal-backdrop in');
      var data = amplify.store('Admin');
      if (typeof(data) != "undefined"){
        var user = data['User']; 
        $('#top_container').addClass('containertop');
        time = new Date();
        this.navigate('#home', true);
      }
      else {
        HomeView.clear();   
        OffcanvasView.clear();
        SidebarView.clear();
        NavbarView.clear();
        $('#top_container').removeClass('containertop');
        this.navigate('#login', true);
        LoginView.render(this);
        NavbarloginView.render();
      }      
    },

    showHome: function( ) {
      var data = amplify.store('Admin');
      if (typeof(data) != "undefined"){
        var user = data['User']; 
        LoginView.clear();
        HomeView.render(this);
        NavbarView.render(this);
        OffcanvasView.render();
        SidebarView.clear();
        if(autologout == 0){        
          autologout++;
          time = new Date();
          this.increase(this);
        }        
        $('#top_container').addClass('containertop');
      }
      else {
        $('#top_container').removeClass('containertop');
        this.navigate('#login', true);
      } 
    },

    increase: function(that){
      var now = new Date(),
          dif = parseInt((now - that.time));
      if (dif > 300000){
        var data = amplify.store('Admin');
        if (typeof(data) != "undefined"){
          var user = data['User'], 
              url = 'http://localhost:9000/login/?id=' + data["id"];
          $.ajax({ 
                 url: url,
                 type: 'DELETE',
                 data: JSON.stringify({
                  }),
                 beforeSend : function(req) { 
                                req.setRequestHeader("content-type", "application/json"); 
                                req.setRequestHeader("accept", "application/json"); 
                                },
              });
          that.autologout = 0;

        $('#autoLogout').removeClass('hidden');
        }
        amplify.store('Admin',null);          
        window.location.hash = 'login';
        $('#autoLogout').removeClass('hidden');
      }
      else {
          setTimeout(that.increase, 10000, that);
      }
    },

    logOut: function(){  
      this.time = 0; 
      this.increase(this);
    }
    
  });
    return Router;
});
