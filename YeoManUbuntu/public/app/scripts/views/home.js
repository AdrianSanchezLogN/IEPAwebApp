var app = app || {};

define([
    'jquery',
    'underscore',
    'backbone',
    'amplify',
    'jquery_form',
	'text!./templates/home.html'
], function ($, _, Backbone, amplify, jquery_form, template) {
    'use strict';

    var HomeView = Backbone.View.extend({
	    el: '#content',
	    template: _.template(template),
		image: '',
	    //param: this.param,

		events : {
		    "change #select_image" : "onSelect",
			"click #save_button": "onSave",
			"click #paypal_button": "onPay",
		},

	    initialize: function() {
	    },

	    render: function() {
			try{
				app.time = new Date();
			    var data = amplify.store("User"),
			    	value = app.value;
				this.$el.html("Welcome " + data["User"]);
			    this.$el.append(this.template({ value: value}));
			    return this;
			}
			catch(err){
				alert("User not logged in yet");
				window.location = "#login";
			}
	    },

		onSelect: function(ev) {
			var input = $(ev.target.files[0]);
			if (input) {
		        var reader = new FileReader();
		        
		        reader.onload = function (e) {
		            $('#prev_img').attr('src', e.target.result);
		        }
		        
		        reader.readAsDataURL(input[0]);
				this.$image = input[0];
		    }
		},

		onSave: function() {
			var data = amplify.store("User"),
          		url = 'http://localhost:9000/image/?user=' + data["id"],
          		that = this;

			$('#uploadForm').submit(function(e) {
				var options = {
					url : url,
					data : { 
                        "authorization": "session_token=1", 
                        "content-type": "application/json", 
                        "accept": "application/json" 
                    },
					success:function(data, textStatus, jqXHR) 
					{
						alert("Image uploaded succesfully");
						that.render();
					},
					error: function(jqXHR, textStatus, errorThrown) 
					{
						alert("Image failed at upload");    
					}
				};
				$(this).ajaxSubmit(options);
				e.preventDefault();
			});
			
			$("#uploadForm").submit();
		},

		onPay: function() {
			var data = amplify.store("User"),
			amount = $("#paypal_amount").val(),
			desc = $("#paypal_description").val(),
			url = 'http://localhost:9000/paypal/?user=' + data["id"] + '&order_amount=' + amount + '&desc=' + desc;
	        $.ajax({ 
	           url: url,
	           type: 'POST',
	           beforeSend : function(req) {  
	           				  req.setRequestHeader("authorization", "session_token=1"); 
	                          req.setRequestHeader("content-type", "application/json"); 
	                          req.setRequestHeader("accept", "application/json"); 
	                          },
	            success: function(data) {
	                window.location = data;
	            }
	        })
	    }
	});

    return HomeView;
});

