/**
 * @description User View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'userCollection',  
  'categoriesCollection',
  'text!./templates/user.html',
  'text!./templates/modalUserEdit.html',
  'text!./templates/searchUser.html',
  'text!./templates/pager_links.html',
  'text!./templates/templateLoading.html'
], function ($, _, Backbone, userCollection, categoriesCollection, templateUser, templateModal, templateSearch, templatePager, templateLoading) {
  'use strict';

  /**
   * @description View Variables {Router and the User Collection instances}
   */
  var UserCollection = new userCollection(),
    CategoriesCollection = new categoriesCollection(),

    UserView = Backbone.View.extend({

    /**
     * @description Element on the page where the View will get Rendered
     */
    el: '#main',
    appRouter: {},
    passAccept: false,
    hasChange: false,
    skip: 1,
    

    /**
     * @description Templates used in the View
     */
    templateUser: _.template(templateUser),
    templateModal: _.template(templateModal),
    templateSearch: _.template(templateSearch),
    templatePager: _.template(templatePager),

    /**
     * @description Event Binding for the View
     */ 
    events: {
      'click .delete': 'deleteFunct',
      'mouseenter #user_div': 'mousemove',         
      'mouseleave #user_div': 'mousemove',  
      'mouseenter .modal': 'mousemove',
      'mouseleave .modal': 'mousemove',    
      'click .editModalUser': 'editFunct',
      'click .check_static': 'checkChanged',
      'change .modalpass1': 'passChanged',
      'change .modalpass2': 'passChanged',
      'click .glyphicon-search': 'findUser',
      'click .pagerButton': 'changePage'
    },

    /**
     * @description Backbone View Constructor
     * @param {Object}
     * @returns {Void}
     */
    initialize: function(router) {
      this.appRouter = router;
      this.skip = 1;
      this.userFetch();
    },

    /**
     * @description Renders the User in the Collection and their respectives modals to edit
     * @returns {Void}
     */  

	render: function() {
      this.skip = 1;
      this.userFetch();
    },

    renderMain: function() {
      var pages;
  	  this.undelegateEvents();
        this.$el.html('').hide().fadeIn().slideDown('slow'); 
        this.$el.append(this.templateSearch());
        UserCollection.each(function(user){
  		if(user.attributes._id){
  		    var classId = user.attributes._id.toString(),
  		      className = '.'+classId+'name';
  		    user.attributes.birthday = user.attributes.birthday.split('T')[0];
  		    user.attributes['categoriesCollection'] = CategoriesCollection;
            	this.appendUser(user.attributes);
  		    //$(className).addClass('name ' + classId);
  		}
        else {
          pages = user.attributes.count / 3;
        }
      }.bind(this));
      this.$el.append(this.templatePager({prev:(this.skip-1), pages:pages }));
      this.autoTop();      
      this.delegateEvents(); 
    },

    autoTop : function() {
      if(this.hasChange === true){
        $('html,body').animate({scrollTop: 0}, 750);
        this.hasChange = false;
      }
      else {

      }
    },

    /**
     * @description Fetch the User in the database to the Collection
     * @returns {Void}
     */ 
    userFetch: function() {
      this.$el.html(templateLoading);
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      UserCollection.fetch({
        data: $.param({ skip: this.skip}),
        beforeSend: setHeader,
        success: function(res){
          CategoriesCollection.fetch({
            beforeSend: setHeader,
            success: function(res){
              this.renderMain();
            }.bind(this)
          });
        }.bind(this)
      });
    },

    /**
     * @description Calls the desired function
     * @params {Number, Object} the number of the option 1=Add 2=Edit, and the event object
     * @returns {Void}
     */ 
    addFunct: function(option, e) {      
      var modalId =  e.currentTarget.value,
        modalname = $('#'+modalId+'_modalnameEdit').val(),        
        modalbirth = $('#'+modalId+'_modalbirthEdit').val(),
        modalerror = '#'+modalId+'_modalerrorInvalid';
      if(option == 1){
        this.addModal();
      }
      if(option == 2){
        if(modalname!='' && modalbirth!=''){
          this.editModal(e);
        }
        else {
          $(modalerror).removeClass('hidden');
          setTimeout(this.addHidden, 2000, modalerror);          
        }
      }
    },

    /**
     * @description Add a User to the database
     * @returns {Void}
     */ 
    addModal: function() {
      var modalname = $('.modalname').val(),
        modallastname = $('.modallastname').val(),
        modalpass = $('.modalpass1').val(),
        modalemail = $('.modalemailUser').val(),        
        modalcountry = $('.modalcountry').val(),        
        modaldire = $('.modaldire').val(),       
        modalbirth = $('.modalbirth').val(),    
        modaladmin = $('.modaladmin'),
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/user/?user=' + data['id'],
        session_token = 'session_token='+data['session_token'];
        if (modaladmin[0].checked){
          modaladmin = 1;
        }
        else modaladmin = 0;
        $.ajax({ 
          url: url,
          type: 'POST',
          data: JSON.stringify({
            'name':modalname, 
            'lastname': modallastname,
            'password':modalpass, 
            'email':modalemail,
            'country':modalcountry,
            'physicalAddress':modaldire, 
            'birthday': modalbirth, 
            'admin':modaladmin
          }),
          beforeSend : function(req) { 
            req.setRequestHeader('content-type', 'application/json'); 
            req.setRequestHeader('accept', 'application/json'); 
            req.setRequestHeader('authorization', session_token); 
          },
          statusCode: {
            200: function(res) {
              this.hasChange = true;           
              $('#userinsertMsg').removeClass('hidden');   
              setTimeout(this.addHidden, 3000, '#userinsertMsg'); 
              this.userFetch();
              $( '#closeModal' ).trigger('click');
            }.bind(this),
            401: function() {
              this.appRouter.logOut();
            }.bind(this),
            408: function() {  
              this.appRouter.logOut();
            }.bind(this),
          }
        });
      },

    /**
     * @description Listener to the Edit Button in the modal that calls the functions to edit a User
     * @params {Object} the event object
     * @returns {Void}
     */ 
    editFunct: function(e) {
      this.addFunct(2, e);
    },

    /**
     * @description Edit a User from the database
     * @params {Object} the event object
     * @returns {Void}
     */ 
    editModal: function(e) {
      var modalId =  e.currentTarget.value,
        modalname = $('#'+modalId+'_modalnameEdit').val(),        
        modallastname = $('#'+modalId+'_modallastnameEdit').val(),
        modalcountry= $('#'+modalId+'_modalcountEdit').val(),        
        modaldire = $('#'+modalId+'_modaldireEdit').val(),
        modalbirth = $('#'+modalId+'_modalbirthEdit').val(),
        modaladmin = $('#'+modalId+'_modaladminEdit'),
        modalClose = '#'+modalId+'_closeModal',
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/user/?user=' + data['id']+'&id='+modalId,
        session_token = 'session_token='+data['session_token'];
        if (modaladmin[0].checked){
          modaladmin = 1;
        }
        else modaladmin = 0;
      $.ajax({ 
        url: url,
        type: 'PUT',
        data: JSON.stringify({
            'name':modalname, 
            'lastname': modallastname, 
            'country':modalcountry,
            'physicalAddress':modaldire, 
            'birthday': modalbirth, 
            'admin':modaladmin
        }),
        beforeSend : function(req) { 
          req.setRequestHeader('content-type', 'application/json'); 
          req.setRequestHeader('accept', 'application/json'); 
          req.setRequestHeader('authorization', session_token); 
        },
        statusCode: {
          200: function(res) {
            this.hasChange = true;
            $('#userupdateMsg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#userupdateMsg'); 
            this.userFetch();
            $(modalClose).trigger('click');                  
            $('.modal-backdrop').addClass('hidden');
          }.bind(this),
          401: function() {
            this.appRouter.logOut();
          }.bind(this),
          408: function() {  
            this.appRouter.logOut();
          }.bind(this),
        }
      });
    },

    /**
     * @description Delete a User from the database
     * @params {Object} the event object
     * @returns {Void}
     */ 
    deleteFunct: function(e) {
      var userId = e.currentTarget.value,
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/user/?user=' + data['id']+'&id='+userId,
        session_token = 'session_token='+data['session_token'];
      $.ajax({ 
        url: url,
        type: 'DELETE',
        data: JSON.stringify({}),
        beforeSend : function(req) { 
          req.setRequestHeader('content-type', 'application/json'); 
          req.setRequestHeader('accept', 'application/json'); 
          req.setRequestHeader('authorization', session_token);
        },
        statusCode: {
          200: function(res) {
            this.hasChange = true;
            $('#userdeleteMsg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#userdeleteMsg'); 
            this.userFetch();
          }.bind(this),
          401: function() {
            this.appRouter.logOut();
          }.bind(this),
          408: function() {  
            this.appRouter.logOut();
          }.bind(this),
        }
      });
    },

    findUser: function(e) {
      var searchOption = $('.searchoption')[0],
        searchType = searchOption[searchOption.selectedIndex].value,
        searchText = $('.searchtext').val();
      if (searchText != ''){
        if (searchText != ''){
          if (searchType == 'id' && isNaN(searchText)){                     
            $('#searcherror').removeClass('hidden');   
            setTimeout(this.addHidden, 2000, '#searcherror');          
          }
          else {
            this.$el.html(templateLoading);
            var setHeader = function (req) {
              req.setRequestHeader('content-type', 'application/json'); 
              req.setRequestHeader('accept', 'application/json'); 
            };
            UserCollection.fetch({
              data: $.param({ skip: -1}),
              beforeSend: setHeader,
                success: function(res){
    				switch (searchType) {
    				  case 'id':
    				    if( isNaN(searchText)){                     
    				      $('#searcherror').removeClass('hidden');   
    				      setTimeout(this.addHidden, 2000, '#searcherror');          
    				    }
    				    else {              
    				      var founded = UserCollection.findWhere({_id: parseInt(searchText)});
    				      this.$el.html('').hide().fadeIn().slideDown('slow'); 
    				      this.$el.append(this.templateSearch());
    				      if (typeof founded === 'undefined'){                
    				        this.$el.append('<h3>Ningún Usuario Coincide con la busqueda</h3>');
    				      }
    				      else {                   
    				        this.$el.append('<h3>Usuario con ID ' + searchText + ' Encontrado</h3>');           
    				        founded.attributes.birthday = founded.attributes.birthday.split('T')[0];
    				        founded.attributes['categoriesCollection'] = CategoriesCollection;
    						this.appendUser(founded.attributes);
    				      }
    				    }
    				    break;
    				  case 'name':
    				    var regex = new RegExp(searchText,'i'),
    				      min = 0;
    				    this.$el.html('').hide().fadeIn().slideDown('slow'); 
    				    this.$el.append(this.templateSearch());
    				    UserCollection.each(function(user){
    				      if(regex.test(user.attributes.name)){
    				        if(min==0){
    				          this.$el.append('<h3>Usuario(s) con "' + searchText + '" en el Nombre Encontrado(s)</h3>');
    				        }
    				        user.attributes.birthday = user.attributes.birthday.split('T')[0];
    				        user.attributes['categoriesCollection'] = CategoriesCollection;
    				        this.appendUser(user.attributes);
    				        min++;
    				      }              
    				    }.bind(this))
    				    if(min==0){
    				      this.$el.append('<h3>Ningún Usuario Encontrado con "' + searchText + '" en el Nombre</h3>');
    				    }
    				    break;
    				  case 'lastname':
    				    var regex = new RegExp(searchText,'i'),
    				      min = 0;
    				    this.$el.html('').hide().fadeIn().slideDown('slow'); 
    				    this.$el.append(this.templateSearch());
    				    UserCollection.each(function(user){
    				      if(regex.test(user.attributes.lastname)){
    				        if(min==0){
    				          this.$el.append('<h3>Usuario(s) con "' + searchText + '" en el Apellido Encontrado(s)</h3>');
    				        }
    				        user.attributes.birthday = user.attributes.birthday.split('T')[0];
    				        user.attributes['categoriesCollection'] = CategoriesCollection;
    				        this.appendUser(user.attributes);
    				        min++;
    				      }              
    				    }.bind(this))
    				    if(min==0){
    				      this.$el.append('<h3>Ningún Usuario Encontrado con "' + searchText + '" en el Apellido</h3>');
    				    }
    				  break;
                  } 
              }.bind(this)
            });   
          } 
        }           
      }
      else {
        $('#searcherror').removeClass('hidden');   
        setTimeout(this.addHidden, 2000, '#searcherror');  
      }
    },

	/**
     * @description Change the page of the pagination
     * @returns {Void}
     */ 
     changePage: function(ev) {
      this.skip = $(ev.currentTarget).attr('value');
      this.hasChange = true;
      this.userFetch();
     },


    addHidden: function(idMsg) {
      $(idMsg).addClass('hidden');
    },

    checkChanged: function(e) {
      if (e.currentTarget.value == 1){
        e.currentTarget.checked = true;
      }
      if (e.currentTarget.value == 0){
        e.currentTarget.checked = false;
      }
      this.mousemove();
    },

    passChanged: function(e) {
      if ($('.modalpass1').val() != $('.modalpass2').val()){        
          $('#modalerror').removeClass('hidden');
      }
      else $('#modalerror').addClass('hidden');
      this.mousemove();
    },

    /**
     * @description Set the new time in for the autologout function
     * @returns {Void}
     */ 
    mousemove: function() {
      this.appRouter.time = new Date();
    },


	appendUser: function(attributes) {
      this.$el.append(this.templateUser(attributes));
      this.$el.append(this.templateModal(attributes));
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
  return UserView;
})

