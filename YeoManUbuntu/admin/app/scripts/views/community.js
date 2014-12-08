/**
 * @description Community View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'communityCollection',
  'text!./templates/community.html',
  'text!./templates/modalCommEdit.html',
  'text!./templates/searchBasic.html',
  'text!./templates/pager_links.html',
  'text!./templates/templateLoading.html'
], function ($, _, Backbone, communityCollection, templateCommunity, templateModal, templateSearch, templatePager, templateLoading) {
  'use strict';

  /**
   * @description View Variables {Router and the Community Collection instances}
   */
  var CommunityCollection = new communityCollection(),

    CommunityView = Backbone.View.extend({

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
    templateCommunity: _.template(templateCommunity),
    templateModal: _.template(templateModal),
    templateSearch: _.template(templateSearch),
    templatePager: _.template(templatePager),

    /**
     * @description Event Binding for the View
     */ 
    events: {
      'click .delete': 'deleteFunct',
      'mouseenter #comm_div': 'mousemove',         
      'mouseleave #comm_div': 'mousemove', 
      'mouseenter .modal': 'mousemove',
      'mouseleave .modal': 'mousemove',     
      'click .editModalComm': 'editFunct',
      'click .glyphicon-search': 'findCommunity',
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
      this.communityFetch();
    },

    /**
     * @description Renders the Community in the Collection and their respectives modals to edit
     * @returns {Void}
     */  
    render: function() {
      this.skip = 1;
      this.communityFetch();
    },

    renderMain: function(that) {
      var pages;
      that.undelegateEvents();
      that.$el.html('').hide().fadeIn().slideDown('slow');     
      that.$el.append(that.templateSearch());
      CommunityCollection.each(function(community){
        if(community.attributes._id){
          var classId = community.attributes._id.toString(),
            className = '.'+classId+'name';
          that.appendCommunity(community.attributes);
          $(className).addClass('name ' + classId);
        }
        else {
          pages = community.attributes.count / 3;
        }
      }.bind(this));
      that.$el.append(that.templatePager({prev:(that.skip-1), pages:pages }));
      that.autoTop();
      that.delegateEvents(); 
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
     * @description Fetch the Community in the database to the Collection
     * @returns {Void}
     */ 
    communityFetch: function() {
      this.$el.html(templateLoading);
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      CommunityCollection.fetch({
        data: $.param({ skip: this.skip}),
        beforeSend: setHeader,
        success: function(res){
          setTimeout(this.renderMain, 1000, this);
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
     * @description Add a Community to the database
     * @returns {Void}
     */ 
    addModal: function() {
      var modalname = $('.modalname').val(),
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/community/?user=' + data['id'],
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
          success:function(data, textStatus, jqXHR) { 
          this.hasChange = true;           
          $('#comminsertMsg').removeClass('hidden');   
          setTimeout(this.addHidden, 3000, '#comminsertMsg'); 
            this.communityFetch();
            $( '#closeModal' ).trigger('click');
          }.bind(this),
        });
      },

    /**
     * @description Listener to the Edit Button in the modal that calls the functions to edit a Community
     * @params {Object} the event object
     * @returns {Void}
     */ 
    editFunct: function(e) {
      this.addFunct(2, e);
    },

    /**
     * @description Edit a Community from the database
     * @params {Object} the event object
     * @returns {Void}
     */ 
    editModal: function(e) {
      var modalId =  e.currentTarget.value,
        modalname = $('#'+modalId+'_modalnameEdit').val(),
        modalClose = '#'+modalId+'_closeModal',
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/community/?user=' + data['id']+'&id='+modalId,
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
            $('#commupdateMsg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#commupdateMsg'); 
            this.communityFetch();
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
     * @description Delete a Community from the database
     * @params {Object} the event object
     * @returns {Void}
     */ 
    deleteFunct: function(e) {
      var communityId = e.currentTarget.value,
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/community/?user=' + data['id']+'&id='+communityId,
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
          $('#commdeleteMsg').removeClass('hidden');   
          setTimeout(this.addHidden, 3000, '#commdeleteMsg'); 
          this.communityFetch();
          }.bind(this),
          401: function() {
            this.appRouter.logOut();
          }.bind(this),
          408: function() {  
            this.appRouter.logOut();
          }.bind(this),
          409: function() {            
            this.hasChange = true; 
            $('#commerro1Msg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#commerro1Msg'); 
          }.bind(this),
        }
      });
    },


    findCommunity: function(e) {
      var searchOption = $('.searchoption')[0],
        searchType = searchOption[searchOption.selectedIndex].value,
        searchText = $('.searchtext').val();
      if (searchText != ''){if (searchType == 'id' && isNaN(searchText)){                     
        $('#searcherror').removeClass('hidden');   
        setTimeout(this.addHidden, 2000, '#searcherror');          
      }
      else {
          this.$el.html(templateLoading);
          var setHeader = function (req) {
            req.setRequestHeader('content-type', 'application/json'); 
            req.setRequestHeader('accept', 'application/json'); 
          };
          CommunityCollection.fetch({
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
                    var founded = CommunityCollection.findWhere({_id: parseInt(searchText)});
                    this.$el.html('').hide().fadeIn().slideDown('slow'); ;
                    this.$el.append(this.templateSearch());
                    if (typeof founded === 'undefined'){                
                      this.$el.append('<h3>Ninguna Comunidad Coincide con la busqueda</h3>');
                    }
                    else {                   
                      this.$el.append('<h3>Comunidad con ID ' + searchText + ' Encontrada</h3>'); 
                      this.appendCommunity(founded.attributes);
                    }
                  }
                  break;
                case 'name':
                  var regex = new RegExp(searchText,'i'),
                    min = 0;
                  this.$el.html('').hide().fadeIn().slideDown('slow'); ;
                  this.$el.append(this.templateSearch());
                  CommunityCollection.each(function(community){
                    if(regex.test(community.attributes.name)){
                      if(min==0){
                        this.$el.append('<h3>Comunidad(es) con "' + searchText + '" en el Nombre Encontrada(s)</h3>');
                      }
                      this.appendCommunity(community.attributes);
                      min++;
                    }              
                  }.bind(this))
                  if(min==0){
                    this.$el.append('<h3>Ninguna Comunidad Encontrada con "' + searchText + '" en el Nombre</h3>');
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
      this.communityFetch();
     },

    /**
     * @description Set the new time in for the autologout function
     * @returns {Void}
     */ 
    mousemove: function() {
      this.appRouter.time = new Date();
    },

    appendCommunity: function(attributes) {
      this.$el.append(this.templateCommunity(attributes));
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
  return CommunityView;
})

