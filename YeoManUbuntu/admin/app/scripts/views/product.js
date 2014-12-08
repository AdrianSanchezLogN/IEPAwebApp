/**
 * @description Products View
 * @author Adrián Sánchez <adriansanchez.logn@gmail.com>
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'productCollection',
  'categoriesCollection',
  'craftsmanCollection',
  'materialCollection',
  'text!./templates/product.html',
  'text!./templates/modalProdEdit.html',
  'text!./templates/searchBasic.html',
  'text!./templates/pager_links.html',
  'text!./templates/modalProductImage.html',
  'text!./templates/templateLoading.html'
], function ($, _, Backbone, productCollection, categoriesCollection, craftsmanCollection, materialCollection, templateProduct, templateModal, templateSearch, templatePager, templateImage, templateLoading) {
  'use strict';

  /**
   * @description View Variables {Router and the News Collection instances}
   */
  var arrayNewCate,
    arrayNewCraf,
    arrayNewMate,
    arrayEditCate,
    arrayEditCraf,
    arrayEditMate,
    ProductCollection = new productCollection(),
    CategoriesCollection = new categoriesCollection(),
    CraftsmanCollection = new craftsmanCollection(),
    MaterialCollection = new materialCollection(),

    ProductView = Backbone.View.extend({

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
    templateProduct: _.template(templateProduct),
    templateModal: _.template(templateModal),
    templateSearch: _.template(templateSearch),
    templatePager: _.template(templatePager),
    templateImage: _.template(templateImage),

    /**
     * @description Event Binding for the View
     */ 
    events: {
      'click .delete': 'deleteFunct',
      'mouseenter #prod_div': 'mousemove',         
      'mouseleave #prod_div': 'mousemove',  
      'mouseenter .modal': 'mousemove',
      'mouseleave .modal': 'mousemove',  
      'change .select_imageEdit': 'showPrev',
      'change .select_image_append': 'addImage',  
      'click .editModalProd': 'editFunct',
      'click [type="checkbox"]':'checkClicked',                    
      'change #numbers [type="text"]':'checkNaN',
      'click .glyphicon-search': 'findProduct',
      'click .pagerButton': 'changePage',
      'click .prev_img': 'showImag',
      'click .add' : 'new_ImageProduct',
      'click .removeImage': 'removeImage'
    },

    /**
     * @description Backbone View Constructor
     * @param {Object}
     * @returns {Void}
     */
    initialize: function(router) {
      this.appRouter = router; 
      this.changeImage = 0;     
      this.arrayNewCate = [];
      this.arrayNewCraf = [];
      this.arrayNewMate = [];
      this.arrayEditCate = {};
      this.arrayEditCraf = {};
      this.arrayEditMate = {};
      this.skip = 1;
      this.productFetch();
    },

    checkClicked: function(e) {
      this.modifyObject(e);
    },
    
    /**
     * @description Renders the Craftsman in the Collection and their respectives modals to edit
     * @returns {Void}
     */  
    render: function() {
      this.skip = 1;
      this.productFetch();
    },

    renderMain: function() {  
      var pages;    
      this.undelegateEvents();
      this.$el.html('').hide().fadeIn().slideDown('slow');      
      this.clearObject();
      this.$el.append(this.templateSearch());
      ProductCollection.each(function(product){
		if(product.attributes._id){
		    var classId = product.attributes._id.toString(),
		      className = '.'+classId+'name',
		      classDesc= '.'+classId+'desc';          
		    this.arrayEditCate[product.attributes._id] = product.attributes.category;
		    this.arrayEditCraf[product.attributes._id] = product.attributes.craftsman;
		    this.arrayEditMate[product.attributes._id] = product.attributes.material;
		    product.attributes['categoriesCollection'] = CategoriesCollection;
		    product.attributes['craftsmanCollection'] = CraftsmanCollection;
		    product.attributes['materialCollection'] = MaterialCollection;
			this.appendProduct(product.attributes);
		    //$(className).addClass('name ' + classId);
		    //$(classDesc).addClass('desc ' + classId);
		}
        else {
          pages = product.attributes.count / 3;
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
    productFetch: function() {
      this.$el.html(templateLoading);
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      ProductCollection.fetch({
        data: $.param({ skip: this.skip}),
        beforeSend: setHeader,
        success: function(res){
          this.categoriesFetch();
        }.bind(this)
      });
    },

    /**
     * @description Fetch the Categories in the database to the Collection
     * @returns {Void}
     */ 
    categoriesFetch: function() {
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      CategoriesCollection.fetch({
        data: $.param({ skip: -1}),
        beforeSend: setHeader,
        success: function(res){
          this.craftsmanFetch();
        }.bind(this)
      });
    },

    /**
     * @description Fetch the Craftsman in the database to the Collection
     * @returns {Void}
     */ 
    craftsmanFetch: function() {
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      CraftsmanCollection.fetch({
        data: $.param({ skip: -1}),
        beforeSend: setHeader,
        success: function(res){
          this.materialFetch();
        }.bind(this)
      });
    },

    /**
     * @description Fetch the Material in the database to the Collection
     * @returns {Void}
     */ 
    materialFetch: function() {
      var setHeader = function (req) {
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json'); 
      }; 
      MaterialCollection.fetch({
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
      this.mousemove();
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
              }
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
     * @description Add a Product to the database
     * @returns {Void}
     */ 
    addModal: function() {
      var modalname = $('.modalname').val(),
        modaldesc = $('.modaldesc').val(),
        modalkey = $('.modalkey').val().split(' '),
        modalprice = parseInt($('.modalprice').val()),
        modalquant = parseInt($('.modalquant').val()),       
        modalimg = encodeURIComponent($('.modalimg').val()),
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/product/?user=' + data['id'],
        session_token = 'session_token='+data['session_token'];
      this.changeImage = 0;
        $.ajax({ 
          url: url,
          type: 'POST',
          data: JSON.stringify({
            'category' : this.arrayNewCate,
            'material' : this.arrayNewMate,
            'craftsman' : this.arrayNewCraf,
            'name' : modalname,
            'description' : modaldesc,
            'quantity' : modalquant,
            'price' : modalprice,
            'image' : [modalimg],
            'keyword' : modalkey
          }),
          beforeSend : function(req) { 
            req.setRequestHeader('content-type', 'application/json'); 
            req.setRequestHeader('accept', 'application/json'); 
            req.setRequestHeader('authorization', session_token); 
          },
          statusCode: {
            200: function(res) {
              this.hasChange = true;
              $('#prodinsertMsg').removeClass('hidden');   
              setTimeout(this.addHidden, 3000, '#prodinsertMsg'); 
              this.productFetch();
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
        modalname = $('#'+modalId+'_modalnameEdit').val(),
        modaldesc= $('#'+modalId+'_modaldescEdit').val(),        
        //modalimg = encodeURIComponent($('#'+modalId+'_modalimgEdit').val().split(',')).split('%2C'),
        modalkey = $('#'+modalId+'_modalkeyEdit').val().split(' '),        
        modalprice = parseInt($('#'+modalId+'_modalpriceEdit').val()),
        modalquant = parseInt($('#'+modalId+'_modalquantEdit').val()), 
        modalcategory = this.arrayEditCate[modalId],
        modalmaterial= this.arrayEditMate[modalId],
        modalcraftsman = this.arrayEditCraf[modalId],
        modalClose = '#'+modalId+'_closeModal',
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/product/?user=' + data['id']+'&id='+modalId,
        session_token = 'session_token='+data['session_token'];;
      $.ajax({ 
        url: url,
        type: 'PUT',
        data: JSON.stringify({
            'category' : modalcategory,
            'material' : modalmaterial,
            'craftsman' : modalcraftsman,
            'name' : modalname,
            'description' : modaldesc,
            'quantity' : modalquant,
            'price' : modalprice,
            'keyword' : modalkey
        }),
        beforeSend : function(req) { 
          req.setRequestHeader('content-type', 'application/json'); 
          req.setRequestHeader('accept', 'application/json'); 
          req.setRequestHeader('authorization', session_token); 
        },
        statusCode: {
          200: function(res) {
            this.hasChange = true;
            $('#produpdateMsg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#produpdateMsg'); 
            this.productFetch();
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
        url = 'http://localhost:9000/product/?user=' + data['id']+'&id='+newsId,
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
            $('#proddeleteMsg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#proddeleteMsg'); 
            this.productFetch();
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
     * @description Edit a News from the database
     * @params {Object} the event object
     * @returns {Void}
     */ 
    new_ImageProduct: function(e) {
      var productId = '#'+e.currentTarget.value+'.select_image_append';
      $(productId).trigger('click');
    },

    addImage: function(ev){
      var input = $(ev.target.files[0]),
        nameImage = 'images/' + input[0]['name'],
        data = amplify.store('Admin'),
        classForm = '#'+ev.currentTarget.id+'.buttonFile',
        modalimg = '#'+ev.currentTarget.id+'.modalimg',
        url = 'http://localhost:9000/image/?user=' + data['id'],
        session_token = 'session_token='+data['session_token'],
        that = this;
        if (input) {
          var reader = new FileReader();              
          reader.onload = function (e) {
              $(modalimg).val(nameImage);
          }              
          reader.readAsDataURL(input[0]);
        }
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
                that.addImageProduct(ev.currentTarget.id, nameImage);
              },
              401: function() {
                that.appRouter.logOut();
              },
              408: function() {  
                that.appRouter.logOut();
              }
            }
          };
          $(this).ajaxSubmit(options);
          e.preventDefault();
        });      
        $(classForm).submit();
    },

    addImageProduct: function(id, imageName){
      var modalId =  id,       
        modalimg = encodeURIComponent(imageName),
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/productImage/?user=' + data['id']+'&id='+modalId,
        session_token = 'session_token='+data['session_token'];;
      $.ajax({ 
        url: url,
        type: 'PUT',
        data: JSON.stringify({
            'image' : modalimg
        }),
        beforeSend : function(req) { 
          req.setRequestHeader('content-type', 'application/json'); 
          req.setRequestHeader('accept', 'application/json'); 
          req.setRequestHeader('authorization', session_token); 
        },
        statusCode: {
          200: function(res) {
            this.hasChange = true;
            $('#produpdateMsg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#produpdateMsg'); 
            this.productFetch();                 
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

    removeImage: function(e) {
      var modalId =  e.currentTarget.value,       
        modalimg = e.currentTarget.id,
        data = amplify.store('Admin'),
        url = 'http://localhost:9000/productImageRemove/?user=' + data['id']+'&id='+modalId,
        session_token = 'session_token='+data['session_token'];;
      $.ajax({ 
        url: url,
        type: 'PUT',
        data: JSON.stringify({
            'image' : modalimg
        }),
        beforeSend : function(req) { 
          req.setRequestHeader('content-type', 'application/json'); 
          req.setRequestHeader('accept', 'application/json'); 
          req.setRequestHeader('authorization', session_token); 
        },
        statusCode: {
          200: function(res) {
            $('.close').trigger('click'); 
            this.hasChange = true;            
            $('#produpdateMsg').removeClass('hidden');   
            setTimeout(this.addHidden, 3000, '#produpdateMsg'); 
            this.productFetch();                
          }.bind(this),
          401: function() {
            this.appRouter.logOut();
          }.bind(this),
          408: function() {  
            this.appRouter.logOut();
          }.bind(this),
        }
      });
      $('.close').trigger('click'); 
      $('.modal-backdrop').addClass('hidden');
    },


    modifyArray: function(e) {
      if(e.currentTarget.checked){
        if(e.currentTarget.name == 'cate'){
          this.arrayNewCate.push(parseInt(e.currentTarget.value));
        }
        if(e.currentTarget.name == 'craf'){
          this.arrayNewCraf.push(parseInt(e.currentTarget.value));
        }
        if(e.currentTarget.name == 'mate'){
          this.arrayNewMate.push(parseInt(e.currentTarget.value));
        }
      }
      else {
        if(e.currentTarget.name == 'cate'){
          var index = this.arrayNewCate.indexOf(parseInt(e.currentTarget.value));
          this.arrayNewCate.splice(index, 1);
        }
        if(e.currentTarget.name == 'craf'){
          var index = this.arrayNewCraf.indexOf(parseInt(e.currentTarget.value));
          this.arrayNewCraf.splice(index, 1);
        }
        if(e.currentTarget.name == 'mate'){
          var index = this.arrayNewMate.indexOf(parseInt(e.currentTarget.value));
          this.arrayNewMate.splice(index, 1);
        }
      }
      this.mousemove();
    },

    clearArray: function() {
      this.arrayNewCate = [];
      this.arrayNewCraf = [];
      this.arrayNewMate = [];
    },

    modifyObject: function(e) {
      if(e.currentTarget.checked){
        if(e.currentTarget.name == 'cate'){
          this.arrayEditCate[parseInt(e.currentTarget.className)].push(parseInt(e.currentTarget.value));
        }
        if(e.currentTarget.name == 'craf'){          
          this.arrayEditCraf[parseInt(e.currentTarget.className)].push(parseInt(e.currentTarget.value));
        }
        if(e.currentTarget.name == 'mate'){
          this.arrayEditMate[parseInt(e.currentTarget.className)].push(parseInt(e.currentTarget.value));
        }
      }
      else {
        if(e.currentTarget.name == 'cate'){
          var index = this.arrayEditCate[parseInt(e.currentTarget.className)].indexOf(parseInt(e.currentTarget.value));
          this.arrayEditCate[parseInt(e.currentTarget.className)].splice(index, 1);
        }
        if(e.currentTarget.name == 'craf'){
          var index = this.arrayEditCraf[parseInt(e.currentTarget.className)].indexOf(parseInt(e.currentTarget.value));
          this.arrayEditCraf[parseInt(e.currentTarget.className)].splice(index, 1);
        }
        if(e.currentTarget.name == 'mate'){
          var index = this.arrayEditMate[parseInt(e.currentTarget.className)].indexOf(parseInt(e.currentTarget.value));
          this.arrayEditMate[parseInt(e.currentTarget.className)].splice(index, 1);
        }
      }
      this.mousemove();
    },

    clearObject: function() {
      this.arrayEditCate = {};
      this.arrayEditCraf = {};
      this.arrayEditMate = {};
    },

    checkNaN: function(e) {
      var idMsg = '#' + e.currentTarget.className,
          classInput = '.' + e.currentTarget.className;
      if(isNaN(e.currentTarget.value)){
          $(idMsg).removeClass('hidden');
          $(classInput).val('');
          $(classInput).focus();
          setTimeout(this.addHidden, 2000, idMsg);
      }
      else{
          $(idMsg).addClass('hidden');
      }
      this.mousemove();
    },

    findProduct: function(e) {
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
            ProductCollection.fetch({
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
    		          var founded = ProductCollection.findWhere({_id: parseInt(searchText)});
    		          this.$el.html('').hide().fadeIn().slideDown('slow'); 
    		          this.$el.append(this.templateSearch());
    		          if (typeof founded === 'undefined'){                
    		            this.$el.append('<h3>Ningún Producto Coincide con la busqueda</h3>');
    		          }
    		          else {                   
    		            this.$el.append('<h3>Producto con ID ' + searchText + ' Encontrada</h3>'); 
    		            founded.attributes['categoriesCollection'] = CategoriesCollection;
    		            founded.attributes['craftsmanCollection'] = CraftsmanCollection;
    		            founded.attributes['materialCollection'] = MaterialCollection;
    					this.appendProduct(founded.attributes);
    		          }
    		        }
    		        break;
    		      case 'name':
    		        var regex = new RegExp(searchText,'i'),
    		          min = 0;
    		        this.$el.html('').hide().fadeIn().slideDown('slow'); 
    		        this.$el.append(this.templateSearch());
    		        ProductCollection.each(function(product){
    		          if(regex.test(product.attributes.name)){
    		            if(min==0){
    		              this.$el.append('<h3>Producto(s) con "' + searchText + '" en el Nombre Encontrada(s)</h3>');
    		            }
    		            product.attributes['categoriesCollection'] = CategoriesCollection;
    		            product.attributes['craftsmanCollection'] = CraftsmanCollection;
    		            product.attributes['materialCollection'] = MaterialCollection;
    					this.appendProduct(product.attributes);
    		            min++;
    		          }              
    		        }.bind(this))
    		        if(min==0){
    		          this.$el.append('<h3>Ningún Producto Encontrada con "' + searchText + '" en el Nombre</h3>');
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
      this.productFetch();
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

	  appendProduct: function(attributes) {
      this.$el.append(this.templateProduct(attributes));
      this.$el.append(this.templateModal(attributes));
      _.each(attributes.image, function(images){
        this.$el.append(this.templateImage({_id:attributes._id, image:images}));
      }.bind(this))
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
  return ProductView;
})

