
define([
    'jquery',
    'underscore',
    'backbone',
    'text!./templates/button-offcanvas.html'
], function ($, _, Backbone, button_template) {
    'use strict';
    var offcanvasView = Backbone.View.extend({
        el: '#button-offcanvas',
        button_template: _.template(button_template),

        events: {
          'click .btn-xs': 'toggleSide'
          },

        initialize: function() {
            this.$el.html();
        },

        render: function() {
            this.$el.html(this.button_template());
        },

        toggleSide: function(e) {
            $('.row-offcanvas').toggleClass('active');
            var clase = $('.row-offcanvas')[0].className.split(' ')[3];
            if(clase == 'active'){
                $('#offcanvasLabel').text('Cerrar Menú');
            }
            else {
                $('#offcanvasLabel').text('Abrir Menú');
            }
        },

      clear: function() {
        this.$el.empty();
        this.undelegateEvents();
      }

    });
    return offcanvasView;
});
