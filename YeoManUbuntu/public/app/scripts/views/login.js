var app = app || {};

define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'text!./templates/login.html'
], function ($, _, Backbone, Router, template) {
    'use strict';
    var LoginView = Backbone.View.extend({
      el: '#content',

      initialize: function( ) {
          //this.render();
      },

      render: function() {
          this.$el.html(template);
          return this;
      },

      events: {
          'click .login_button': 'loginFunct'
      },

      loginFunct: function() {
          var email = $( '#email' ).val();
          var pass = $( '#pass' ).val();

          $.ajax({ 
             url: 'http://localhost:9000/login/',
             type: 'POST',
             data: JSON.stringify({
                'email':email,
                'pass':pass
              }),
             beforeSend : function(req) { 
                            req.setRequestHeader("content-type", "application/json"); 
                            req.setRequestHeader("accept", "application/json"); 
                            },
              statusCode: {
                  200: function(res) {
                      amplify.store('User', res);
                      alert('LogIn Succesful');
                      app.time = new Date();
                      app.value = 0;
                      increase();
                      window.location = '#home';
                  },
                  401: function(res) {
                    alert(res['error']);
                  }
              }
          });
      },
  });
    return LoginView;
},
increase = function(){
    var now = new Date(),
        dif = parseInt((now - app.time));
    if (dif > 300000){
      var data = amplify.store("User");
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
      amplify.store("User",null);
      alert("The time without activity has expired, please Log In again");
      window.location = "#login";
    }
    else {
      //console.log(dif);
      setTimeout( increase, 10000 );
    }
  });

