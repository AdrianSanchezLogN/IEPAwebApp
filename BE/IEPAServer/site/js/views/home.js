var app = app || {};

app.HomeView = Backbone.View.extend({
    el: '#content',
    //param: this.param,

    initialize: function() {
        //this.render();
    },

    render: function() {
		try{
			app.time = new Date();
		    var data = amplify.store("User");
		    this.$el.html("Bienvenido " + data["User"]);
		    return this;
		}
		catch(err){
			alert("User not logged in yet");
			window.location = "#login";
		}
    },

});
