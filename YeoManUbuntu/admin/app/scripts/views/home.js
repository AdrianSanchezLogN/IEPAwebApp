/**
 * @description Home View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'amplify',
  'jquery_form',
	'text!./templates/home.html'
], function ($, _, Backbone, amplify, jquery_form, template) {
  'use strict';

  /**
   * @description View Variable {Router}
   */
  var HomeView = Backbone.View.extend({

  	/**
     * @description Element on the page where the View will get Rendered
     */
    el: '.jumbotron',
    appRouter: {},
    manualPage: 1,

    /**
     * @description Templates used in the View
     */
    template: _.template(template),

    /**
     * @description Event Binding for the View
     */ 
		events : {
			'mouseenter #home_div': 'mousemove',
			'mouseleave #home_div': 'mousemove',
      'mouseenter .modal': 'mousemove',
      'mouseleave .modal': 'mousemove',
      'click .help-button': 'manualNext',
      'click .user_help': 'manualInit',
      'keydown': 'keyPressed'
		},

		/**
     * @description Backbone View Constructor
     * @returns {Void}
     */
    initialize: function() {
    	this.$el.html();
    },

    /**
     * @description Renders the View with the logged in user
     * @param {Object} Router
     * @returns {Void}
     */  
    render: function(router) {
    	this.delegateEvents(); 
    	this.appRouter = router;
		  var data = amplify.store('Admin');
	    this.$el.html(this.template({data:data['User']}));  
	    return this;
    },

    manualInit: function() {
      var page = window.location.hash;
      this.manualPage = 1;
      $('.help-button').removeClass('current-help');
      $('.1').addClass('current-help');
      if(page == '#home') { 
        $('#img_manual_1').removeClass();
        $('#img_manual_1').addClass('img_modalImage');    
        $('#helpButton_1').trigger('click');
        $('#img_manual_1').addClass('img_manualImage_Home_1');
        $('.help-text')[0].innerHTML = 'Bienvenido al Home del Administrador de Contenido. Seleccione el módulo a administrar.';
      }
      else {
        $('#img_manual_2').removeClass();
        $('#img_manual_2').addClass('img_modalImage');
        $('#helpButton_2').trigger('click');
        $('#img_manual_2').addClass('img_manualImage_Options_1');
        $('.help-text_2')[0].innerHTML = 'Ha seleccionado un módulo para administrar. Existen dos opciones principales.';
      }
    },

    manualNext: function(e) {
      var page = window.location.hash;
      this.mousemove();
      $('.help-button').removeClass('current-help');
      $(e.currentTarget).addClass('current-help');
      this.manualPage = e.currentTarget.value;
      if(page == '#home'){
        $('#img_manual_1').removeClass();
        $('#img_manual_1').addClass('img_modalImage');       
        if(e.currentTarget.value == 1){
          $('#img_manual_1').addClass('img_manualImage_Home_1');
          $('.help-text')[0].innerHTML = 'Bienvenido al Home del Administrador de Contenido. Seleccione la opción a administrar.';
        }
        else if(e.currentTarget.value == 2){
          $('#img_manual_1').addClass('img_manualImage_Home_2');
          $('.help-text')[0].innerHTML = 'La opción seleccionada quedará marcada y se continuará a la página respectiva.';
        }
      }
      else {
        $('#img_manual_2').removeClass();
        $('#img_manual_2').addClass('img_modalImage'); 
        switch(e.currentTarget.value){   
          case 1:  
            $('#img_manual_2').addClass('img_manualImage_Options_1');
            $('.help-text_2')[0].innerHTML = 'Ha seleccionado un módulo para administrar. Existen dos opciones principales "Listar" y "Crear".';
            break;
          case 2:
            $('#img_manual_2').addClass('img_manualImage_Options_2');
            $('.help-text_2')[0].innerHTML = 'Al seleccionar la opción de "Listar", se muestran todos los ítems relacionados.';
            break;
          case 3:
            $('#img_manual_2').addClass('img_manualImage_Options_3');
            $('.help-text_2')[0].innerHTML = 'Se pueden filtrar los ítems por ID, nombre, apellido o título respectivamente.';
            break;
          case 4:
            $('#img_manual_2').addClass('img_manualImage_Options_4');
            $('.help-text_2')[0].innerHTML = 'Al presionar el botón de buscar, con el texto vacío o con datos inválidos, la aplicación se lo indicará.';
            break;
          case 5:
            $('#img_manual_2').addClass('img_manualImage_Options_5');
            $('.help-text_2')[0].innerHTML = 'Una vez finalizada la búsqueda por ID, se retorna el ítem encontrado.';
            break;
          case 6:
            $('#img_manual_2').addClass('img_manualImage_Options_6');
            $('.help-text_2')[0].innerHTML = 'Al realizar la búsqueda por nombre, apellido o título, se muestran los ítems que coincidan.';
            break;
          case 7:
            $('#img_manual_2').addClass('img_manualImage_Options_7');
            $('.help-text_2')[0].innerHTML = 'En caso de no encontrar un ID, se indicará mediante un mensaje.';
            break;
          case 8:
            $('#img_manual_2').addClass('img_manualImage_Options_8');
            $('.help-text_2')[0].innerHTML = 'También, si ningún ítem coincide con la busqueda por letras, la aplicación lo indicará.';
            break;
          case 9:
            $('#img_manual_2').addClass('img_manualImage_Options_9');
            $('.help-text_2')[0].innerHTML = 'Al seleccionar la opción de "Crear" o "Editar", se desplegará la ventana para añadir un ítem nuevo o editar el seleccionado.';
            break;
          case 10:
            $('#img_manual_2').addClass('img_manualImage_Options_10');
            $('.help-text_2')[0].innerHTML = 'Se deben llenar mínimo los campos obligatorios, mientras que los demás campos y la imagen, son opcionales.';
            break;
          case 11:
            $('#img_manual_2').addClass('img_manualImage_Options_11');
            $('.help-text_2')[0].innerHTML = 'Al presionar "Agregar", la aplicación añade el nuevo ítem y muestra un mensaje de confirmación.';
            break;
          case 12:
            $('#img_manual_2').addClass('img_manualImage_Options_12');
            $('.help-text_2')[0].innerHTML = 'También al "Editar", despliega la confirmación.';
            break;
          case 13:
            $('#img_manual_2').addClass('img_manualImage_Options_13');
            $('.help-text_2')[0].innerHTML = 'Igualmente al presionar "Eliminar".';
            break;
        }
      }
    },

    keyPressed: function(e) {
      var page = window.location.hash,
        now = '';
      if(e.keyCode == 39){
        this.manualPage ++;
      }
      else if(e.keyCode == 37){
        this.manualPage --;
      } 
      if(this.manualPage<=0){
        this.manualPage = 1;
      }
      if(page == '#home'){
        if(this.manualPage > 2){
          this.manualPage = 2;
        }
        now = '.manualMain.help-button.' + this.manualPage.toString();
      }
      else{
        if(this.manualPage > 13){
          this.manualPage = 13;
        }
        now = '.manualHome.help-button.' + this.manualPage.toString();
      }
      $(now).click();
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

  return HomeView;

});

