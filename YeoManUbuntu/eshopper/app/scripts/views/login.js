/**
 * @description Login View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!./templates/header-menu.html',    
    'text!./templates/header-menu-logged.html',
    'text!./templates/templateLoading.html'
], function ($, _, Backbone, templateOut, templateIn, templateLoading) {
    'use strict';

  /**
   * @description View Variable {EventBus}
   */
  var EventBus = {},
    LoginView = Backbone.View.extend({

    /**
     * @description Element on the page where the View will get Rendered
     */
    el: '.header-shop-menu',
    appRouter: {},
    modalUp: false,
    emailAccept: false,
    manualPage: 1,
    templateOut: _.template(templateOut),
    templateIn: _.template(templateIn),    
    carAmmount: 0,
    cartItems: {},
    passAccept: false,            
    passAcceptReg: false,
    birthAccept: false,
    nameAccept: false,
    descAccept: false,

    /**
     * @description Event Binding for the View
     */ 
    events: {
      'click .login_button': 'loginFunct', 
      'click .logout': 'logOut', 
      'click .acceptModal': 'passFunct',
      'click .forget': 'modalBoolean',
      'keydown': 'keyPressed',
      'change #modalemailLogin': 'checkMail',
      'click .help-button': 'manualNext',
      'click .user_help': 'manualInit',               
      'change .modalpass1': 'passRegex',
      'change [type="password"]': 'passChanged',
      'click #example1': 'dateClicked',
      'change .modalemailUser': 'checkMail',
      'change .modalemail': 'checkMail2',
      'change .modalname': 'changeName',
      'change .modalbirth': 'changeBirth',
      'change .modaldesc': 'changeDesc',
      'change .modaltext': 'changeText',
      'change .modaltitle': 'changeTitle',
      'click .saveSignin': 'signIn'
    },

    /**
     * @description Backbone View Constructor
     * @returns {Void}
     */
    initialize: function(eventBus) {
      this.$el.html();    
      EventBus = eventBus;
      EventBus.on('add:cart', (function (param) {
        this.addCart(param);
      }.bind(this))); 
      EventBus.on('login:out', function (num) {
        this.render(this.appRouter);
      }.bind(this)); 
    },

    /**
     * @description Renders the View
     * @param {Object} Router
     * @returns {Void}
     */  
    render: function(router) {
      this.delegateEvents();       
      this.appRouter = router;
      var data = amplify.store('User');
      if (typeof(data) != 'undefined'){
        var user = data['User']; 
        this.appRouter.time = new Date();        
        this.$el.html(this.templateIn);
      }
      else {        
        this.$el.html(this.templateOut);
      }      
    },

    /**
     * @description Logs In the user in the application
     * @returns {Void}
     */  
    loginFunct: function() {
      var email = $( '#email' ).val(),
        pass = $( '#pass' ).val(); 
      $('#closeModal').trigger('click');       
      $('.modal-backdrop').remove();
      this.$el.html(templateLoading);     
      $.ajax({ 
        url: 'http://localhost:9000/login/',
        type: 'POST',
        data: JSON.stringify({
          'email':email, 
          'pass':pass
        }),
        beforeSend : function(req) { 
          req.setRequestHeader('content-type', 'application/json'); 
          req.setRequestHeader('accept', 'application/json'); 
        },  
        statusCode: {
          200: function(res) {            
            amplify.store('User', res);
            this.appRouter.time = new Date();             
            this.appRouter.autologout = 1;  
            this.appRouter.increase(this.appRouter);
            this.render(this.appRouter);
            $('#cart_text')[0].innerHTML = this.carAmmount;
          }.bind(this),
          401: function() {            
            $('#errorLogin').removeClass('hidden');
            setTimeout(this.addHidden, 4000, '#errorLogin'); 
          }.bind(this)
        }
      });
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
      this.render(this.appRouter);
    },

    addCart: function(param){
      var data = amplify.store('User');
      if (typeof(data) != "undefined"){
        var data = amplify.store('User'),
          url = 'http://localhost:9000/addCart/?id=' + data["id"];
        if(typeof(this.cartItems[param.item]) == 'undefined'){
          this.cartItems[param.item] = param.quantity;
        }
        else{
          this.cartItems[param.item] = this.cartItems[param.item] + param.quantity;
        }
        this.carAmmount = this.carAmmount + param.quantity;
        $('#cart_text')[0].innerHTML = this.carAmmount;
        $(msgId).removeClass('hidden'); 
        setTimeout(this.addHidden, 2000, msgId); 
        /*$.ajax({ 
          url: url,
          type: 'PUT',
          data: this.cartItems,
          beforeSend : function(req) { 
            req.setRequestHeader('content-type', 'application/json'); 
            req.setRequestHeader('accept', 'application/json'); 
          },
          statusCode: {
            200: function(res) {            
              this.carAmmount = this.carAmmount + param.quantity;
              $('#cart_text')[0].innerHTML = this.carAmmount;
              $(msgId).removeClass('hidden'); 
              setTimeout(this.addHidden, 2000, msgId); 
            }.bind(this),
            401: function() {            
              $('#errorLogin').removeClass('hidden');
              setTimeout(this.addHidden, 4000, '#errorLogin'); 
            }.bind(this)
          }
        });*/
      }
      else {
        $('#loginButton').trigger('click'); 
      }
    },

    passRegex: function(e) {
      if ($('.modalpass1').val() != ''){
          var regex = /^((?=.*[!#$%&?_"])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!#$%&?_"]{8,}$)/;
          if (regex.test($('.modalpass1').val())){
              this.passAcceptReg = true;
              $('#modalerrorRegexPass').addClass('hidden');                        
          }
          else {
              this.passAcceptReg = false;                        
              $('#modalerrorRegexPass').removeClass('hidden');
          }
      }
      else this.passAcceptReg = false;
    },

    passChanged: function(e) {
        if (($('.modalpass1').val() != $('.modalpass2').val()) && $('.modalpass2').val() != '') {        
            $('#modalerrorPass').removeClass('hidden');
            this.passAccept = false;
        }
        else {
            $('#modalerrorPass').addClass('hidden');
            this.passAccept = true;
        }
        this.mousemove();
    },

    checkMail: function(e) {
        if ($('.modalemailUser').val() != ''){
            var regex = /^[a-zA-Z0-9_.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}/;
            if(regex.test($('.modalemailUser').val())){
                $('#modalerrorRegexEmail').addClass('hidden');
                $('#modalgoodEmail').removeClass('hidden');
                $('#modalerrorEmail').addClass('hidden');
                this.emailAccept = true;
            }
            else {
                $('#modalgoodEmail').addClass('hidden');
                $('#modalerrorEmail').addClass('hidden');                        
                $('#modalerrorRegexEmail').removeClass('hidden');
                this.emailAccept = false;
            }
        }
        else {
            $('#modalgoodEmail').addClass('hidden');
            $('#modalerrorEmail').addClass('hidden');
            $('#modalerrorRegexEmail').addClass('hidden');
            this.emailAccept = false;
        }
        this.mousemove();
    },

    checkMail2: function(e) {
        if ($('.modalemail').val() != ''){
            var regex = /^[a-zA-Z0-9_]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}/;
            if(regex.test($('.modalemail').val())){
                $('#modalgoodEmail').removeClass('hidden');
                $('#modalerrorRegexEmail').addClass('hidden');
                this.emailAccept = true;
            }
            else {
                $('#modalgoodEmail').addClass('hidden');                       
                $('#modalerrorRegexEmail').removeClass('hidden');
                this.emailAccept = false;
            }
        }
        else {
            $('#modalgoodEmail').addClass('hidden');
            $('#modalerrorRegexEmail').addClass('hidden');
            this.emailAccept = false;
        }
        this.mousemove();
    },

    changeName: function() {
        if ($('.modalname').val() != ''){
            this.nameAccept = true;
        }
        else {
            this.nameAccept = false;
        }
        this.mousemove();
    },

    changeBirth: function() {
        if ($('.modalbirth').val() != ''){
            this.birthAccept = true;
        }
        else {
            this.birthAccept = false;
        }
        this.mousemove();
    },

    changeDesc: function() {
        if ($('.modaldesc').val() != ''){
            this.descAccept = true;
        }
        else {
            this.descAccept = false;
        }
        this.mousemove();
    },
    changeText: function() {
        if ($('.modaltext').val() != ''){
            this.textAccept = true;
        }
        else {
            this.textAccept = false;
        }
        this.mousemove();
    },

    changeTitle: function() {
        if ($('.modaltitle').val() != ''){
            this.titleAccept = true;
        }
        else {
            this.titleAccept = false;
        }
        this.mousemove();
    },

    signIn: function(){

    },

    addHidden: function(idMsg) {
      $(idMsg).addClass('hidden');
    },

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

  return LoginView;
});


