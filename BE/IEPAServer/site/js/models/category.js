var app = app || {};

app.Category = Backbone.Model.extend({
    defaults: {
	    "_id" : 1,
	    "description" : "Native handmade masks",
	    "name" : "Masks"
	}
});
