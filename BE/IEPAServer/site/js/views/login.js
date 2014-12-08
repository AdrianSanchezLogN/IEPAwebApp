var app = app || {};

app.LoginView = Backbone.View.extend({
    el: '#content',
    template: _.template( $( '#loginTemplate' ).html() ),

    initialize: function( ) {
        //this.render();
    },

    render: function() {
        this.$el.html( this.template( ) );
        return this;
    },

    events: {
        'click .login_button': 'loginFunct'
    },

    loginFunct: function() {
        var email = $( '#email' ).val();
            pass = $( '#pass' ).val();

        $.ajax({ 
           url: 'http://localhost:3000/login/',
           type: 'POST',
           data: JSON.stringify({
              "email":email, 
              "pass":pass
            }),
           beforeSend : function(req) { 
                          req.setRequestHeader("authorization", "session_token=1"); 
                          req.setRequestHeader("content-type", "application/json"); 
                          req.setRequestHeader("accept", "application/json"); 
                          },
            statusCode: {
                200: function(res) {
                    amplify.store("User", res);
                    alert("LogIn Succesful");
					app.time = new Date();
					increase();
                    window.location = "#home";
                },
                401: function() {
                  alert( "error: Email or password incorrect" );
                }
            }
        });
    },
});

increase = function(){
	var now = new Date();
		  dif = parseInt((now - app.time));
	if (dif > 300000){
    var data = amplify.store("User");
        url = 'http://localhost:3000/login/?id=' + data["id"];
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
}
