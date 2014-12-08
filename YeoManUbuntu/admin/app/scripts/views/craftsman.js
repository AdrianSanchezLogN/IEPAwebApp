/**
 * @description Craftsman View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'craftsmanCollection',
  'communityCollection',
  'text!./templates/craftsman.html',
  'text!./templates/modalCraftEdit.html',
  'text!./templates/searchUser.html',
  'text!./templates/pager_links.html',
  'text!./templates/modalImage.html',
  'text!./templates/templateLoading.html'
], function ($, _, Backbone, craftsmanCollection, communityCollection, templateCraftsman, templateModal, templateSearch, templatePager, templateImage, templateLoading) {
  'use strict';

  /**
   * @description View Variables {Router and the Craftsman Collection instances}
   */
  var CraftsmanCollection = new craftsmanCollection(),
    CommunityCollection = new communityCollection(),

    CraftsmanView = Backbone.View.extend({

    /**
     * @description Element on the page where the View will get Rendered
     */
    el: '#main',
    appRouter: {},
    changeImage: 0,
    hasChange: false,
    skip: 1,

    /**
     * @description Templates used in the View
     */
    templateCraftsman: _.template(templateCraftsman),
    templateModal: _.template(templateModal),    
    templateSearch: _.template(templateSearch),
    templatePager: _.template(templatePager),
    templateImage: _.template(templateImage),

    /**
     * @description Event Binding for the View
     */ 
    events: {
      'click .delete': 'deleteFunct',
      'mouseenter #craft_div': 'mousemove',         
      'mouseleave #craft_div': 'mousemove', 
      'mouseenter .modal': 'mousemove',
      'mouseleave .modal': 'mousemove',      
      'change .select_imageEdit': 'showPrev',
      'click .editModalCraft': 'editFunct',
      'click .glyphicon-search': 'findCraft',
      'click .pagerButton': 'changePage',
      'click .prev_img': 'showImag'
    },

    /**
     * @description Backbone View Constructor
     * @param {Object}
     * @returns {Void}
     */
    initialize: function(router) {
      this.changeImage = 0;
      this.appRouter = router;
      this.skip = 1;
    },

    /**
     * @description Renders the Craftsman in the Collection and their respectives modals to edit
     * @returns {Void}
     */  
    render: function() {
      this.skip = 1;
      this.craftsmanFetch();
    },

    renderMain: function() {
      var pages;
      this.undelegateEvents();
      this.$el.html('').hide().fadeIn().slideDown('slow');    
      this.$el.append(this.templateSearch());   
      CraftsmanCollection.each(function(craftsman){
        if(craftsman.attributes._id){
          var classId = craftsman.attributes._id.toString(),
            className = '.'+classId+'name',
            classDesc= '.'+classId+'desc',
            craftsmanCommunity = CommunityCollection.findWhere({'_id': craftsman.attributes.community}),
            communityName = craftsmanCommunity.attributes.name;
          craftsman.attributes['communityName'] = communityName;
          craftsman.attributes['communities'] = CommunityCollection;
          this.appendCraftsman(craftsman.attributes);
          $(className).addClass('name ' + classId);
          $(classDesc).addClass('desc ' + classId);
        }
        else {
          pages = craftsman.attributes.count / 5;
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
     * @description Fetch the Craftsman in the database to the Collection
     * @returns {Void}
     */ 
    craftsmanFetch: function() {
      this.$el.html(templateLoading);
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      CraftsmanCollection.fetch({
        data: $.param({ skip: this.skip}),
        beforeSend: setHeader,
        success: function(res){
          this.communityFetch();
        }.bind(this)
      });
    },

    communityFetch: function() {
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      CommunityCollection.fetch({
        data: $.param({ skip: -1}),
        beforeSend: setHeader,
        success: function(res){
          this.renderMain();
        }.bind(this)
      });
    },
    /**
     * @description Show the image selected in the modal
     * @params {Object} the event object
     * @returns {Void}
     */ 
    showPrev: function(ev) {
      var input = $(ev.target.files[0]),
        nameImage = 'images/' + input[0]['name'],
        imageId = '#' + ev.currentTarget.id.split('_')[0] + '_img_modalEdit';
      this.changeImage = 1;
      if (input) {
        var reader = new FileReader();              
        reader.onload = function (e) {
            $(imageId).attr('src', e.target.result);
            $('.modalimgEdit').val(nameImage);
        }              
        reader.readAsDataURL(input[0]);
      }
    },

    /**
     * @description Add an Image to the server and calls the other function
     * @params {Number, Object} the number of the option 1=Add 2=Edit, and the event object
     * @returns {Void}
     */ 
    addFunct: function(option, ev) {
      if(this.changeImage == 1){
        var data = amplify.store('Admin'),
          url = 'http://localhost:9000/image/?user=' + data['id'],
          session_token = 'session_token='+data['session_token'],
          that = this,
          classForm = '.'+ev.currentTarget.id;
        $(classForm).submit(function(e) {
          var options = {
            url : url,
            data : { 
              'authorization': session_token, 
              'content-type': 'application/json', 
              'accept': 'application/json' 
            },
            statusCode: {
              200: function(res) {
                that.changeImage = 0;
                if(option == 1){
                  that.addModal();
                }
                if(option == 2){
                  that.editModal(ev);
                }
              },
              401: function() {
                that.appRouter.logOut();
              },
              408: function() {  
                that.appRouter.logOut();
              },
            }
          };
          $(this).ajaxSubmit(options);
          e.preventDefault();
        });      
        $(classForm).submit();
      }
      else {
        if(option == 1){
          this.addModal();
        }
        if(option == 2){
          this.editModal(ev);
        }
      }
    },

    /**
     * @description Add a Craftsman to the database
     * @returns {Void}
     */ 
    addModal: function() {
      var modalname = $('.modalname').val(),
        modallastname = $('.modallastname').val(),
        modaldesc = $('.modaldesc').val(),
        modalemail = $('.modalemail').val(),
        modalimg = encodeURIComponent($('.modalimg').val()),        
        modalSelect = $('.modalselect')[0],
        modalcommunity = parseInt(modalSelect[modalSelect.selectedIndex].value),
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/craftsman/?user=' + data['id'],
        session_token = 'session_token='+data['session_token'];
      this.changeImage = 0;
        $.ajax({ 
          url: url,
          type: 'POST',
          data: JSON.stringify({
            'name': modalname, 
            'lastname': modallastname,
            'description': modaldesc,
            'image': [modalimg],
            'email': modalemail,
            'community': modalcommunity
          }),
          beforeSend : function(req) { 
            req.setRequestHeader('content-type', 'application/json'); 
            req.setRequestHeader('accept', 'application/json'); 
            req.setRequestHeader('authorization', session_token); 
          },
          statusCode: {
            200: function(res) {
              this.hasChange = true;   
              $('#crafinsertMsg').removeClass('hidden');   
              setTimeout(this.addHidden, 3000, '#crafinsertMsg'); 
              this.craftsmanFetch();
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
     * @description Listener to the Edit Button in the modal that calls the functions to edit a Craftsman
     * @params {Object} the event object
     * @returns {Void}
     */ 
    editFunct: function(e) {
      this.addFunct(2, e);
    },

    /**
     * @description Edit a Craftsman from the database
     * @params {Object} the event object
     * @returns {Void}
     */ 
    editModal: function(e) {
      var modalId =  e.currentTarget.value,
        modalname = $('#'+modalId+'_modalnameEdit').val(),        
        modallastname = $('#'+modalId+'_modallastnameEdit').val(),
        modaldesc = $('#'+modalId+'_modaldescEdit').val(),
        modalemail = $('#'+modalId+'_modalemailEdit').val(),
        modalimg = encodeURIComponent($('#'+modalId+'_modalimgEdit').val()),
        modalSelect = $('#'+modalId+'_selectEdit')[0],
        modalcommunity = parseInt(modalSelect[modalSelect.selectedIndex].value),
        modalClose = '#'+modalId+'_closeModal',
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/craftsman/?user=' + data['id']+'&id='+modalId,
        session_token = 'session_token='+data['session_token'];;
      $.ajax({ 
        url: url,
        type: 'PUT',
        data: JSON.stringify({
          'name': modalname, 
          'lastname': modallastname,
          'description': modaldesc,
          'image': [modalimg],
          'email': modalemail,
          'community': modalcommunity
        }),
        beforeSend : function(req) { 
          req.setRequestHeader('content-type', 'application/json'); 
          req.setRequestHeader('accept', 'application/json'); 
          req.setRequestHeader('authorization', session_token); 
        },
        statusCode: {
          200: function(res) {
            this.hasChange = true;
            $('#crafupdateMsg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#crafupdateMsg');
            this.craftsmanFetch();
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
     * @description Delete a Craftsman from the database
     * @params {Object} the event object
     * @returns {Void}
     */ 
    deleteFunct: function(e) {
      var craftsmanId = e.currentTarget.value,
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/craftsman/?user=' + data['id']+'&id='+craftsmanId,
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
            this.craftsmanFetch();
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
          }
        }
      });
    },


    findCraft: function(e) {
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
        CraftsmanCollection.fetch({
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
                  var founded = CraftsmanCollection.findWhere({_id: parseInt(searchText)});
                  this.$el.html('').hide().fadeIn().slideDown('slow'); 
                  this.$el.append(this.templateSearch());
                  if (typeof founded === 'undefined'){                
                    this.$el.append('<h3>Ningún Artesano Coincide con la busqueda</h3>');
                  }
                  else {               
                    var craftsmanCommunity = CommunityCollection.findWhere({'_id': founded.attributes.community}),
                    communityName = craftsmanCommunity.attributes.name;
                    founded.attributes['communityName'] = communityName;
                    founded.attributes['communities'] = CommunityCollection;                  
                    this.$el.append('<h3>Artesano con ID ' + searchText + ' Encontrado</h3>');  
                    this.appendCraftsman(founded.attributes);
                  }
                }
                break;
              case 'name':
                var regex = new RegExp(searchText,'i'),
                  min = 0;
                this.$el.html('').hide().fadeIn().slideDown('slow'); 
                this.$el.append(this.templateSearch());
                CraftsmanCollection.each(function(craftsman){
                  if(regex.test(craftsman.attributes.name)){
                    if(min==0){
                      this.$el.append('<h3>Artesano(s) con "' + searchText + '" en el Nombre Encontrado(s)</h3>');
                    }
                    var craftsmanCommunity = CommunityCollection.findWhere({'_id': craftsman.attributes.community}),
                    communityName = craftsmanCommunity.attributes.name;
                    craftsman.attributes['communityName'] = communityName;
                    craftsman.attributes['communities'] = CommunityCollection; 
                    this.appendCraftsman(craftsman.attributes);
                    min++;
                  }              
                }.bind(this))
                if(min==0){
                  this.$el.append('<h3>Ningún Artesano Encontrado con "' + searchText + '" en el Nombre</h3>');
                }
                break;
              case 'lastname':
                var regex = new RegExp(searchText,'i'),
                  min = 0;
                this.$el.html('').hide().fadeIn().slideDown('slow'); 
                this.$el.append(this.templateSearch());
                CraftsmanCollection.each(function(craftsman){
                  if(regex.test(craftsman.attributes.lastname)){
                    if(min==0){
                      this.$el.append('<h3>Artesano(s) con "' + searchText + '" en el Apellido Encontrado(s)</h3>');
                    }
                    var craftsmanCommunity = CommunityCollection.findWhere({'_id': craftsman.attributes.community}),
                    communityName = craftsmanCommunity.attributes.name;
                    craftsman.attributes['communityName'] = communityName;
                    craftsman.attributes['communities'] = CommunityCollection; 
                    this.appendCraftsman(craftsman.attributes);
                    min++;
                  }              
                }.bind(this))
                if(min==0){
                  this.$el.append('<h3>Ningún Artesano Encontrado con "' + searchText + '" en el Apellido</h3>');
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

    /**
     * @description Change the page of the pagination
     * @returns {Void}
     */ 
     changePage: function(ev) {
      this.skip = $(ev.currentTarget).attr('value');
      this.hasChange = true;
      this.craftsmanFetch();
     },

    addHidden: function(idMsg) {
      $(idMsg).addClass('hidden');
    },
    /**
     * @description Set the new time in for the autologout function
     * @returns {Void}
     */ 
    mousemove: function() {
      this.appRouter.time = new Date();
    },

    appendCraftsman: function(attributes) {
      this.$el.append(this.templateCraftsman(attributes));
      this.$el.append(this.templateModal(attributes));
      this.$el.append(this.templateImage(attributes));
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
  return CraftsmanView;
})

