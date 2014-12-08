var app = app || {};

app.CateMenuView = Backbone.View.extend({
    el: '#cate_navbar',
    template: _.template( $( '#catemenuTemplate' ).html() ),

    initialize: function() {
        //_.bindAll(this, 'render');
        this.render();
        //this.render();
    },

    render: function() {
        var that = this;
        $.ajax({ 
           url: 'http://localhost:3000/category/',
           type: 'GET',
           beforeSend : function(req) {  
                          req.setRequestHeader("content-type", "application/json"); 
                          req.setRequestHeader("accept", "application/json"); 
                          },
            success: function(data) {
                var datos = { target:data };
                this.$el.html( this.template(datos) );
            }.bind(this)
        })
    }

});
