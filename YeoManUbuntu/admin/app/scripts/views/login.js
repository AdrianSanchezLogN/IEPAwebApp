/**
 * @description Home View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!./templates/adminLogin.html',
    'text!./templates/modalLoading.html'
], function ($, _, Backbone, template, modalLoading) {
    'use strict';

  /**
   * @description View Variable {Router}
   */
  var LoginView = Backbone.View.extend({

    /**
     * @description Element on the page where the View will get Rendered
     */
    el: '.jumbotron',
    appRouter: {},
    modalUp: false,
    emailAccept: false,
    manualPage: 1,

    /**
     * @description Event Binding for the View
     */ 
    events: {
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
      this.$el.html(template);
      this.$el.append(modalLoading);
      this.emailAccept = false;    
      $('.help-button').removeClass('current-help');
      $('.button-first').addClass('current-help');
      return this;
    },

    keyPressed: function(e) {
      if(e.keyCode == 13 && this.modalUp == false){
        this.loginFunct();
      }	
      else if(e.keyCode == 39 && this.manualPage < 7){
        this.manualPage ++;        
        var now = '.help-button.' + this.manualPage.toString();
        $(now).click();
      }
      else if(e.keyCode == 37 && this.manualPage > 1){
        this.manualPage --;      
        var now = '.help-button.' + this.manualPage.toString();
        $(now).click();
      } 
    },

    modalBoolean: function() {
      this.modalUp = true;
    },

    /**
     * @description Logs In the user in the application
     * @returns {Void}
     */  
    loginFunct: function() {
      var email = $( '#email' ).val(),
        pass = $( '#pass' ).val();
      //$( '#loading_click' ).trigger('click');
      $.ajax({ 
        url: 'http://localhost:9000/admin/',
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
            amplify.store('Admin', res);
            this.appRouter.time = new Date();             
            this.appRouter.autologout = 1;            
            $( '#closeLoading' ).trigger('click');
            this.appRouter.increase(this.appRouter);
            this.appRouter.navigate('#home', true);
          }.bind(this),
          401: function() {            
            $( '#closeLoading' ).trigger('click');
            $('#errorLogin').removeClass('hidden');
            setTimeout(this.addHidden, 4000, '#errorLogin'); 
          }.bind(this)
        }
      });
    },

    passFunct: function() {
      if (this.emailAccept){
        $( '#closeModal' ).trigger('click');
        $( '#loading_click' ).trigger('click');
        var email = $( '#modalemailLogin' ).val();
        $.ajax({ 
          url: 'http://localhost:9000/email/',
          type: 'POST',
          data: JSON.stringify({
            'email':email
          }),
          beforeSend : function(req) { 
            req.setRequestHeader('content-type', 'application/json'); 
            req.setRequestHeader('accept', 'application/json'); 
          },
          success:function(data, textStatus, jqXHR) {
            $('#msgForget').removeClass('hidden');
            setTimeout(this.addHidden, 3000, '#msgForget'); 
            $( '#closeLoading' ).trigger('click');
            $('#modalemailLogin').val('');
            this.modalUp = false;
            this.emailAccept = false;
          }.bind(this),
          error: function(res) {
            $('#modalerrorFound').removeClass('hidden');             
            $( '#closeLoading' ).trigger('click');
            setTimeout(this.addHidden, 3000, '#modalerrorFound');         
            $('#modalemailLogin').val('');
            this.modalUp = true;
            this.emailAccept = false;
          }.bind(this)
        });
      }
      else {
        $('#modalerrorRegexEmail').removeClass('hidden');
      }
    },

    checkMail: function(e) {
      if ($('#modalemailLogin').val() != ''){
          var regex = /^[a-zA-Z0-9_.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}/;
          if(regex.test($('#modalemailLogin').val())){
            $('#modalerrorRegexEmail').addClass('hidden');
            this.emailAccept = true;
          }
          else {
              $('#modalerrorRegexEmail').removeClass('hidden');
              this.emailAccept = false;
          }
      }
      else {
        $('#modalerrorRegexEmail').removeClass('hidden');
        this.emailAccept = false;
      }
    },


    addHidden: function(idMsg) {
      $(idMsg).addClass('hidden');
    },

    manualInit: function() {
      this.manualPage = 1;
      $('.help-button').removeClass('current-help');
      $('.button-first').addClass('current-help');
      $('#img_manualLogin').removeClass();
      $('#img_manualLogin').addClass('img_modalImage');
      $('#img_manualLogin').addClass('img_manualImage_Login_1');
      $('.help-text')[0].innerHTML = 'Bienvenido al Administrador de Contenido. Lo primero que debe realizar es iniciar sesión.';
    },

    manualNext: function(e) {     
      $('.help-button').removeClass('current-help');
      $(e.currentTarget).addClass('current-help');
      $('#img_manualLogin').removeClass();
      $('#img_manualLogin').addClass('img_modalImage');      
      this.manualPage = e.currentTarget.value;
      if(e.currentTarget.value == '1'){
        $('#img_manualLogin').addClass('img_manualImage_Login_1');
        $('.help-text')[0].innerHTML = 'Bienvenido al Administrador de Contenido. Lo primero que debe realizar es iniciar sesión.';
      }
      else if(e.currentTarget.value == '2'){
        $('#img_manualLogin').addClass('img_manualImage_Login_2');
        $('.help-text')[0].innerHTML = 'Debe introducir el correo y la contraseña de Administrador, con lo cual se ingresa al Home.';
      }
      else if(e.currentTarget.value == '3'){
        $('#img_manualLogin').addClass('img_manualImage_Login_3');        
        $('.help-text')[0].innerHTML = 'En caso de que el correo o la contraseña no sean aceptados la aplicación se lo indicará.';
      }
      else if(e.currentTarget.value == '4'){
        $('#img_manualLogin').addClass('img_manualImage_Login_4');
        $('.help-text')[0].innerHTML = 'Si se le olvidó la contraseña, puede solicitar que se la reenvien al correo.';
      }
      else if(e.currentTarget.value == '5'){
        $('#img_manualLogin').addClass('img_manualImage_Login_5');
        $('.help-text')[0].innerHTML = 'Debe ingresar un correo válido, en caso contrario la aplicación se lo señalará.';
      }
      else if(e.currentTarget.value == '6'){
        $('#img_manualLogin').addClass('img_manualImage_Login_6');
        $('.help-text')[0].innerHTML = 'La aplicación comprueba la pertenencia del correo a un usuario y envía la contraseña al mismo.';
      }
      else if(e.currentTarget.value == '7'){
        $('#img_manualLogin').addClass('img_manualImage_Login_7');
        $('.help-text')[0].innerHTML = 'De otra manera la aplicación indicará que el correo no es válido.';
      }
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


