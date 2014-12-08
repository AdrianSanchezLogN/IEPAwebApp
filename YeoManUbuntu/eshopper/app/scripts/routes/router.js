define([
    'jquery',
    'backbone',
    'amplify',
    'headerView',
    'sliderView',
    'sidebarView',
    'homeView'
], function ($, Backbone, amplify, headerView, sliderView, sidebarView, homeView) {
    'use strict';

    var time = new Date(),
        autologout = 0,
        SliderView = new sliderView(),
        EventBus = {};    
        _.extend(EventBus, Backbone.Events);

        var 
        HeaderView = new headerView(EventBus), 
        HomeView = new homeView(EventBus),
        SidebarView = new sidebarView(EventBus),
        Router = Backbone.Router.extend({

    routes:{     
      'user': 'showUser',
      'contact': 'showContact',      
      'prod/:id': 'showProduct',
      '': 'showPage',
      '*notFound': 'another'
    },

    showPage: function( ) {      
      $('.navbar_menu').removeClass('active');      
      $('.navbar_menu_home').addClass('active');  
      SliderView.render();
      SidebarView.render(this);
      HomeView.render(this);
      $('.backdrop').removeClass('modal-backdrop in');
      HeaderView.render(this);
    },

    showProduct: function(id) {
      SliderView.clear();
      HomeView.clear();
      SidebarView.clear();
      SidebarView.render(this);
      HomeView.renderProduct(id.split('=')[1]);
    },

    showContact: function() {
      SliderView.clear();
      SidebarView.clear();
      HomeView.clear();      
      $('.navbar_menu').removeClass('active');      
      $('.navbar_menu_contact').addClass('active');      
    },

    another: function() {      
      $('.navbar_menu').removeClass('active');      
      $('.navbar_menu_home').addClass('active'); 
      SliderView.clear();
      HomeView.clear();
      SidebarView.render(this);
    },

    increase: function(that){
      var now = new Date(),
          dif = parseInt((now - that.time));
      if (dif > 300000){
        var data = amplify.store('User');
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
        amplify.store('User',null);          
        window.location.hash = '';
        EventBus.trigger('login:out');
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
