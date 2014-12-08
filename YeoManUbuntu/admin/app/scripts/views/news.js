/**
 * @description News View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'newsCollection',
  'text!./templates/news.html',
  'text!./templates/modalNewsEdit.html',
  'text!./templates/searchNews.html',
  'text!./templates/pager_links.html',
  'text!./templates/modalImage.html',
  'text!./templates/templateLoading.html'
], function ($, _, Backbone, newsCollection, templateNews, templateModal, templateSearch, templatePager, templateImage, templateLoading) {
  'use strict';

  /**
   * @description View Variables {Router and the News Collection instances}
   */
  var NewsCollection = new newsCollection(),
    NewsView = Backbone.View.extend({

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
    templateNews: _.template(templateNews),
    templateModal: _.template(templateModal),
    templateSearch: _.template(templateSearch),
    templatePager: _.template(templatePager),
    templateImage: _.template(templateImage),

    /**
     * @description Event Binding for the View
     */ 
    events: {
      'click .delete': 'deleteFunct',
      'mouseenter #news_div': 'mousemove',         
      'mouseleave #news_div': 'mousemove', 
      'mouseenter .modal': 'mousemove',
      'mouseleave .modal': 'mousemove',   
      'change .select_imageEdit': 'showPrev',   
      'click .editModalNews': 'editFunct',
      'click .glyphicon-search': 'findNews',
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
      this.newsFetch();
    },

    /**
     * @description Renders the News in the Collection and their respectives modals to edit
     * @returns {Void}
     */  
    render: function() { 
      this.skip = 1;
      this.newsFetch();        
    },

    renderMain: function() {
      var pages;
      this.undelegateEvents();
      this.$el.html('').hide().fadeIn().slideDown('slow'); 
      this.$el.append(this.templateSearch());
      NewsCollection.each(function(news){        
        if(news.attributes._id){
          var classId = news.attributes._id.toString(),
            className = '.'+classId+'name';          
          this.appendNews(news.attributes);
        }
        else {
          pages = news.attributes.count / 3;
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
     * @description Fetch the News in the database to the Collection
     * @returns {Void}
     */ 
    newsFetch: function() {
      this.$el.html(templateLoading);
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      NewsCollection.fetch({        
        data: $.param({ skip: this.skip}),
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
     * @description Add a News to the database
     * @returns {Void}
     */ 
    addModal: function() {
      var modaltitle = $('.modaltitle').val(),
        modaltext = $('.modaltext').val(),
        modallink = encodeURIComponent($('.modallink').val()),        
        modalimg = encodeURIComponent($('.modalimg').val()),
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/news/?user=' + data['id'],
        session_token = 'session_token='+data['session_token'];
      this.changeImage = 0; 
        $.ajax({ 
          url: url,
          type: 'POST',
          data: JSON.stringify({
            'title': modaltitle,
            'text': modaltext,
            'link': modallink,
            'image': [modalimg]
          }),
          beforeSend : function(req) { 
            req.setRequestHeader('content-type', 'application/json'); 
            req.setRequestHeader('accept', 'application/json'); 
            req.setRequestHeader('authorization', session_token); 
          },
          statusCode: {
            200: function(res) {
              this.hasChange = true;
              $('#newsinsertMsg').removeClass('hidden');   
              setTimeout(this.addHidden, 3000, '#newsinsertMsg'); 
              this.newsFetch();
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
     * @description Listener to the Edit Button in the modal that calls the functions to edit a News
     * @params {Object} the event object
     * @returns {Void}
     */ 
    editFunct: function(e) {
      this.addFunct(2, e);
    },

    /**
     * @description Edit a News from the database
     * @params {Object} the event object
     * @returns {Void}
     */ 
    editModal: function(e) {
      var modalId =  e.currentTarget.value,
        modaltitle = $('#'+modalId+'_modaltitleEdit').val(),
        modaltext= $('#'+modalId+'_modaltextEdit').val(),        
        modalimg = encodeURIComponent($('#'+modalId+'_modalimgEdit').val()),
        modallink = $('#'+modalId+'_modallinkEdit').val(),
        modalClose = '#'+modalId+'_closeModal',
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/news/?user=' + data['id']+'&id='+modalId,
        session_token = 'session_token='+data['session_token'];;
      $.ajax({ 
        url: url,
        type: 'PUT',
        data: JSON.stringify({
            'title': modaltitle,
            'text': modaltext,
            'link': modallink,
            'image': [modalimg]
        }),
        beforeSend : function(req) { 
          req.setRequestHeader('content-type', 'application/json'); 
          req.setRequestHeader('accept', 'application/json'); 
          req.setRequestHeader('authorization', session_token); 
        },
        statusCode: {
          200: function(res) {
            this.hasChange = true;
            $('#newsupdateMsg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#newsupdateMsg'); 
            this.newsFetch();
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
     * @description Delete a News from the database
     * @params {Object} the event object
     * @returns {Void}
     */ 
    deleteFunct: function(e) {
      var newsId = e.currentTarget.value,
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/news/?user=' + data['id']+'&id='+newsId,
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
            $('#newsdeleteMsg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#newsdeleteMsg'); 
            this.newsFetch();
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


    findNews: function(e) {
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
            var setHeader = function (req) {
              req.setRequestHeader('content-type', 'application/json'); 
              req.setRequestHeader('accept', 'application/json'); 
            };
            NewsCollection.fetch({
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
                    var founded = NewsCollection.findWhere({_id: parseInt(searchText)});
                    this.$el.html('').hide().fadeIn().slideDown('slow'); 
                    this.$el.append(this.templateSearch());
                    if (typeof founded === 'undefined'){                
                      this.$el.append('<h3>Ninguna Noticia Coincide con la busqueda</h3>');
                    }
                    else {                   
                      this.$el.append('<h3>Noticia con ID ' + searchText + ' Encontrada</h3>'); 
                      this.appendNews(founded.attributes);
                    }
                  }
                  break;
                case 'name':
                  var regex = new RegExp(searchText,'i'),
                    min = 0;
                  this.$el.html('').hide().fadeIn().slideDown('slow'); 
                  this.$el.append(this.templateSearch());
                  NewsCollection.each(function(news){
                    if(regex.test(news.attributes.title)){
                      if(min==0){
                        this.$el.append('<h3>Noticia(s) con "' + searchText + '" en el Título Encontrada(s)</h3>');
                      }
                      this.appendNews(news.attributes);
                      min++;
                    }              
                  }.bind(this))
                  if(min==0){
                    this.$el.append('<h3>Ninguna Noticia Encontrada con "' + searchText + '" en el Título</h3>');
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
      this.newsFetch(this.skip);
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

    appendNews: function(attributes) {
      this.$el.append(this.templateNews(attributes));
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
  return NewsView;
})

