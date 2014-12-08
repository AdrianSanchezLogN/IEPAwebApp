var app = app || {};

var loginView = new app.LoginView();
var homeView = new app.HomeView();

var Workspace = Backbone.Router.extend({
    routes:{
      'login': 'showLogin',
      'home': 'showHome',
    },

    showLogin: function( ) {
      loginView.render();
    },

  showHome: function( ) {
      homeView.render();
    },

  });

  app.WorkRouter = new Workspace();
  Backbone.history.start();