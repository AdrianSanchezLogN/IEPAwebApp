var app = app || {};

define([
    'jquery',
    'underscore',
    'backbone',
    'amplify'
], function ($, _, Backbone, amplify) {
    'use strict';

    var PaypalView = Backbone.View.extend({
	    el: '#content',
	    //param: this.param,

		events : {
		},

	    initialize: function() {
	    },

	    render: function(pay_id, state, total, currency, desc) {
			try{
				app.time = new Date();
			    var data = amplify.store('User'),
			    	value = app.value;
				this.$el.html(data['User'] + ' the response from Paypal is </br></br>');
			    this.$el.append('Payment Id:            ' + pay_id.split('=')[1] + '</br>');
			    this.$el.append('Payment State:         ' + state.split('=')[1] + '</br>');
			    this.$el.append('Payment Total:         ' + currency.split('=')[1] + ' ' + total.split('=')[1] + '</br>');
			    this.$el.append('Payment Description:   ' + desc.split('=')[1] + '</br>');
			    return this;
			}
			catch(err){
				alert('User not logged in yet');
				window.location = '#login';
			}
	    },
	});

    return PaypalView;
});

