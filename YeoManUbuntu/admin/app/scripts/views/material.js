/**
 * @description Material View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'materialCollection',
  'stickit',
  'text!./templates/material.html',
  'text!./templates/modalMatEdit.html',
  'text!./templates/searchBasic.html',
  'text!./templates/pager_links.html',
  'text!./templates/templateLoading.html'
], function ($, _, Backbone, materialCollection, Stickit, templateMaterial, templateModal, templateSearch, templatePager, templateLoading) {
  'use strict';

  /**
   * @description View Variables {Router and the Material Collection instances}
   */
  var MaterialCollection = new materialCollection(),

    MaterialView = Backbone.View.extend({

    /**
     * @description Element on the page where the View will get Rendered
     */
    el: '#main',
    appRouter: {},
    hasChange: false,
    skip: 1,

    /**
     * @description Templates used in the View
     */
    templateMaterial: _.template(templateMaterial),
    templateModal: _.template(templateModal),
    templateSearch: _.template(templateSearch),
    templatePager: _.template(templatePager),

    /**
     * @description Event Binding for the View
     */ 
    events: {
      'click .delete': 'deleteFunct',
      'mouseenter #mat_div': 'mousemove',         
      'mouseleave #mat_div': 'mousemove', 
      'mouseenter .modal': 'mousemove',
      'mouseleave .modal': 'mousemove',     
      'click .editModalMat': 'editFunct',
      'click .glyphicon-search': 'findMaterial',
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
      this.materialFetch();
    },

    /**
     * @description Renders the Material in the Collection and their respectives modals to edit
     * @returns {Void}
     */  
    render: function() {        
      this.skip = 1;
      this.materialFetch();
    },

    renderMain: function() {
      var pages;
      this.undelegateEvents();
      this.$el.html('').hide().fadeIn().slideDown('slow'); 
      this.$el.append(this.templateSearch());
      MaterialCollection.each(function(material){
        if(material.attributes._id){
          var classId = material.attributes._id.toString(),
            className = '.'+classId+'name';
          this.$el.append(this.templateMaterial(material.attributes));
          this.$el.append(this.templateModal(material.attributes));
          $(className).addClass('name ' + classId);
        }
        else {
          pages = material.attributes.count / 3;
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
     * @description Fetch the Material in the database to the Collection
     * @returns {Void}
     */ 
    materialFetch: function() {
      this.$el.html(templateLoading);
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      MaterialCollection.fetch({  
        data: $.param({ skip: this.skip}),
        beforeSend: setHeader,
        success: function(res){
          this.renderMain();
        }.bind(this)
      });
    },

    
    /**
     * @description Calls the other function
     * @params {Number, Object} the number of the option 1=Add 2=Edit, and the event object
     * @returns {Void}
     */ 
    addFunct: function(option, e) {
      if(option == 1){
        this.addModal();
      }
      if(option == 2){
        this.editModal(e);
      }
    },

    /**
     * @description Add a Material to the database
     * @returns {Void}
     */ 
    addModal: function() {
      var modalname = $('.modalname').val(),
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/material/?user=' + data['id'],
        session_token = 'session_token='+data['session_token'];;
        $.ajax({ 
          url: url,
          type: 'POST',
          data: JSON.stringify({
            'name': modalname
          }),
          beforeSend : function(req) { 
            req.setRequestHeader('content-type', 'application/json'); 
            req.setRequestHeader('accept', 'application/json'); 
            req.setRequestHeader('authorization', session_token); 
          },
          statusCode: {
            200: function(res) {
              this.hasChange = true;
              $('#mateinsertMsg').removeClass('hidden');   
              setTimeout(this.addHidden, 3000, '#mateinsertMsg');  
              this.materialFetch();
              $( '#closeModal' ).trigger('click');
            }.bind(this),
            401: function() {
              this.appRouter.logOut();
            }.bind(this),
            408: function() {  
              this.appRouter.logOut();
            }.bind(this),
            409: function() {
              this.hasChange = true;
              $('#craferro1Msg').removeClass('hidden');   
              setTimeout(this.addHidden, 3000, '#craferro1Msg');
            }.bind(this)
          }
        });
      },

    /**
     * @description Listener to the Edit Button in the modal that calls the functions to edit a Material
     * @params {Object} the event object
     * @returns {Void}
     */ 
    editFunct: function(e) {
      this.addFunct(2, e);
    },

    /**
     * @description Edit a Material from the database
     * @params {Object} the event object
     * @returns {Void}
     */ 
    editModal: function(e) {
      var modalId =  e.currentTarget.value,
        modalname = $('#'+modalId+'_modalnameEdit').val(),
        modalClose = '#'+modalId+'_closeModal',
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/material/?user=' + data['id']+'&id='+modalId,
        session_token = 'session_token='+data['session_token'];;
      $.ajax({ 
        url: url,
        type: 'PUT',
        data: JSON.stringify({
          'name': modalname
        }),
        beforeSend : function(req) { 
          req.setRequestHeader('content-type', 'application/json'); 
          req.setRequestHeader('accept', 'application/json'); 
          req.setRequestHeader('authorization', session_token); 
        },
        statusCode: {
          200: function(res) {
            this.hasChange = true;
            $('#mateupdateMsg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#mateupdateMsg'); 
            this.materialFetch();
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
     * @description Delete a Material from the database
     * @params {Object} the event object
     * @returns {Void}
     */ 
    deleteFunct: function(e) {
      var communityId = e.currentTarget.value,
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/material/?user=' + data['id']+'&id='+communityId,
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
            $('#matedeleteMsg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#matedeleteMsg'); 
            this.materialFetch();
          }.bind(this),
          401: function() {
            this.appRouter.logOut();
          }.bind(this),
          408: function() {  
            this.appRouter.logOut();
          }.bind(this),
          409: function() {
            this.hasChange = true;
            $('#mateerro1Msg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#mateerro1Msg'); 
          }.bind(this),
        }
      });
    },

    findMaterial: function(e) {
      var searchOption = $('.searchoption')[0],
        searchType = searchOption[searchOption.selectedIndex].value,
        searchText = $('.searchtext').val();
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
          MaterialCollection.fetch({
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
                    var founded = MaterialCollection.findWhere({_id: parseInt(searchText)});
                    this.$el.html('').hide().fadeIn().slideDown('slow');
                    this.$el.append(this.templateSearch());
                    if (typeof founded === 'undefined'){                
                      this.$el.append('<h3>Ningún Material Coincide con la busqueda</h3>');
                    }
                    else {                   
                      this.$el.append('<h3>Material con ID ' + searchText + ' Encontrada</h3>'); 
                      this.appendMaterial(founded.attributes);
                    }
                  }
                  break;
                case 'name':
                  var regex = new RegExp(searchText,'i'),
                    min = 0;
                  this.$el.html('').hide().fadeIn().slideDown('slow');
                  this.$el.append(this.templateSearch());
                  MaterialCollection.each(function(material){
                    if(regex.test(material.attributes.name)){
                      if(min==0){
                        this.$el.append('<h3>Material(es) con "' + searchText + '" en el Nombre Encontrada(s)</h3>');
                      }
                      this.appendMaterial(material.attributes);
                      min++;
                    }              
                  }.bind(this))
                  if(min==0){
                    this.$el.append('<h3>Ningún Material Encontrado con "' + searchText + '" en el Nombre</h3>');
                  }
                  break;
              } 
            }.bind(this)
          });    
        }           
      }
      else {
        $('#searcherror').removeClass('hidden');   
        setTimeout(this.addHidden, 2000, '#searcherror');  
      }
    },

    addHidden: function(idMsg) {
      $(idMsg).addClass('hidden');
    },

    /**
     * @description Change the page of the pagination
     * @returns {Void}
     */ 
     changePage: function(ev) {
      this.skip = $(ev.currentTarget).attr('value');
      this.hasChange = true;
      this.materialFetch();
     },

    /**
     * @description Set the new time in for the autologout function
     * @returns {Void}
     */ 
    mousemove: function() {
      this.appRouter.time = new Date();
    },

    appendMaterial: function(attributes) {
      this.$el.append(this.templateMaterial(attributes));
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
  return MaterialView;
})

