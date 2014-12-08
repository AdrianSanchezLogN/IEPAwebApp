
define([
    'jquery',
    'underscore',
    'backbone',    
    'categoryView', 
    'craftsmanView',
    'communityView',
    'materialView',    
    'newsView',  
    'productView',
    'userView',
    'categoriesCollection',
    'craftsmanCollection',
    'materialCollection',    
    'communityCollection',      
    'emailCollection',   
    'amplify',   
    'jquery_form',
    'text!./templates/sidebar.html',
    'text!./templates/modalCategory.html',
    'text!./templates/modalCraftsmen.html',
    'text!./templates/modalCommunity.html',
    'text!./templates/modalMaterial.html',
    'text!./templates/modalNews.html',
    'text!./templates/modalProduct.html',
    'text!./templates/modalUser.html'
], function ($, _, Backbone,  categoryView, craftsmanView, communityView, materialView, newsView, productView, userView, categoriesCollection, craftsmanCollection, materialCollection, communityCollection, emailCollection, amplify, jquery_form, side_template, modal_Cat_template, modal_Craft_template, modal_Comm_template, modal_Mat_template, modal_News_template, modal_Prod_template, modal_User_template) {
    'use strict';

    var CategoryView,
        CraftsmanView,
        CommunityView,
        MaterialView,
        NewsView,
        ProductView,
        UserView,
        CommunityCollection = new communityCollection(),
        CategoriesCollection = new categoriesCollection(),
        CraftsmanCollection = new craftsmanCollection(),
        MaterialCollection = new materialCollection(),
        EmailCollection = new emailCollection(),
        SidebarView = Backbone.View.extend({
            el: '#sidebar',
            side_template: _.template(side_template),
            modal_Cat_template: _.template(modal_Cat_template),
            modal_Craft_template: _.template(modal_Craft_template),
            modal_Comm_template: _.template(modal_Comm_template),
            modal_Mat_template: _.template(modal_Mat_template),
            modal_News_template: _.template(modal_News_template),
            modal_Prod_template: _.template(modal_Prod_template),            
            modal_User_template: _.template(modal_User_template),
            option: '',
            views: {},
            appRouter: {},
            passAccept: false,            
            passAcceptReg: false,
            emailAccept: false,
            birthAccept: false,
            nameAccept: false,
            descAccept: false,
            textAccept: false,
            titleAccept: false,
            priceAccept: false,
            quantAccept: false,

            events: {
                'click .list-group-item': 'renderMain',
                'click #closeModal': 'closeModal',
                'click .closeModal': 'closeModal',
                'click .saveModal': 'saveModal',
                'change .select_image': 'showPrev',
                'hidden.bs.modal #myModal': 'closeModal',
                'mouseenter #sidebar-list': 'mousemove',
                'mouseleave #sidebar-list': 'mousemove', 
                'mouseenter .modal': 'mousemove',
                'mouseleave .modal': 'mousemove',         
                'click [type="checkbox"]':'checkClicked',                     
                'change .modalprice':'checkNaNprice',
                'change .modalquant':'checkNaNquant',                
                'change .modalpass1': 'passRegex',
                'change [type="password"]': 'passChanged',
                'click #example1': 'dateClicked',
                'change .modalemailUser': 'checkMail',
                'change .modalemail': 'checkMail2',
                'change .modalname': 'changeName',
                'change .modalbirth': 'changeBirth',
                'change .modaldesc': 'changeDesc',
                'change .modaltext': 'changeText',
                'change .modaltitle': 'changeTitle'
            },

            initialize: function() {
                this.views = {};
            },

            Fetch: function(name, router) {
                switch (name){
                    case 'craft': 
                        var setHeader = function (req) {
                            req.setRequestHeader('content-type', 'application/json'); 
                            req.setRequestHeader('accept', 'application/json'); 
                          }; 
                          CommunityCollection.fetch({
                            data: $.param({ skip: -1}),
                            beforeSend: setHeader,
                            success: function(res){
                                this.render(name, router);
                            }.bind(this)
                          });
                        break;
                    case 'prod': 
                        var setHeader = function (req) {
                            req.setRequestHeader('content-type', 'application/json'); 
                            req.setRequestHeader('accept', 'application/json'); 
                          }; 
                          CategoriesCollection.fetch({
                            data: $.param({ skip: -1}),
                            beforeSend: setHeader,
                            success: function(res){
                                CraftsmanCollection.fetch({
                                    data: $.param({ skip: -1}),
                                    beforeSend: setHeader,
                                    success: function(res){
                                        MaterialCollection.fetch({
                                            data: $.param({ skip: -1}),
                                            beforeSend: setHeader,
                                            success: function(res){
                                                this.render(name, router);
                                            }.bind(this)
                                          });
                                    }.bind(this)
                                  });
                            }.bind(this)
                          });
                        break;
                    case 'user': 
                        var setHeader = function (req) {
                            req.setRequestHeader('content-type', 'application/json'); 
                            req.setRequestHeader('accept', 'application/json'); 
                          }; 
                          CategoriesCollection.fetch({
                            data: $.param({ skip: -1}),
                            beforeSend: setHeader,
                            success: function(res){
                                EmailCollection.fetch({
                                    data: $.param({ skip: -1}),
                                    beforeSend: setHeader,
                                    success: function(res){
                                        this.render(name, router);
                                    }.bind(this)
                                  });
                            }.bind(this)
                          });
                        break;
                    default:
                        this.render(name, router);
                }
            },

            render: function(name, router) {  
                this.appRouter = router; 
                this.undelegateEvents(); 
                this.passAccept = false;            
                this.passAcceptReg = false;
                this.emailAccept = false;
                this.birthAccept = false;
                this.nameAccept = false;  
                this.descAccept = false; 
                this.textAccept = false;  
                this.titleAccept = false; 
                this.priceAccept = false;
                this.quantAccept = false;
                if ((this.views[name] !== this.views[this.option]) && (typeof this.views[this.option] !== 'undefined')) {
                    this.views[this.option].undelegateEvents();
                }                
                switch (name) {
                    case 'cat': 
                        if(typeof this.views[name] === 'undefined'){
                            CategoryView = new categoryView(this.appRouter);  
                        }                       
                        this.views[name] = CategoryView;
                        this.$el.html(this.side_template({data:'Categorías'})).hide().fadeIn().slideDown('slow'); 
                        this.$el.append(this.modal_Cat_template());
                        break;
                    case 'craft': 
                        if(typeof this.views[name] === 'undefined'){
                            CraftsmanView = new craftsmanView(this.appRouter, this.CommunityCollection);  
                        }                       
                        this.views[name] = CraftsmanView;
                        this.$el.html(this.side_template({data:'Artesanos'})).hide().fadeIn().slideDown('slow'); 
                        this.$el.append(this.modal_Craft_template({'communities':CommunityCollection}));
                        break;
                    case 'comm': 
                        if(typeof this.views[name] === 'undefined'){
                            CommunityView = new communityView(this.appRouter);  
                        }                       
                        this.views[name] = CommunityView;
                        this.$el.html(this.side_template({data:'Comunidades'})).hide().fadeIn().slideDown('slow'); 
                        this.$el.append(this.modal_Comm_template());
                        break;
                    case 'mat': 
                        if(typeof this.views[name] === 'undefined'){
                            MaterialView = new materialView(this.appRouter);  
                        }                       
                        this.views[name] = MaterialView;
                        this.$el.html(this.side_template({data:'Materiales'})).hide().fadeIn().slideDown('slow'); 
                        this.$el.append(this.modal_Mat_template());
                        break;
                    case 'news': 
                        if(typeof this.views[name] === 'undefined'){
                            NewsView = new newsView(this.appRouter);  
                        }                       
                        this.views[name] = NewsView;
                        this.$el.html(this.side_template({data:'Noticias'})).hide().fadeIn().slideDown('slow'); 
                        this.$el.append(this.modal_News_template());
                        break;
                    case 'prod': 
                        if(typeof this.views[name] === 'undefined'){
                            ProductView = new productView(this.appRouter);  
                        }                       
                        this.views[name] = ProductView;
                        this.$el.html(this.side_template({data:'Productos'})).hide().fadeIn().slideDown('slow'); 
                        this.$el.append(this.modal_Prod_template({categoriesCollection: CategoriesCollection, craftsmanCollection: CraftsmanCollection, materialCollection: MaterialCollection}));
                        break;
                    case 'user': 
                        if(typeof this.views[name] === 'undefined'){
                            UserView = new userView(this.appRouter);  
                        }                       
                        this.views[name] = UserView;
                        this.$el.html(this.side_template({data:'Usuarios'})).hide().fadeIn().slideDown('slow'); 
                        this.$el.append(this.modal_User_template());
                        break;
                }
                this.option = name;  
                this.views[name].render(); 
                this.views[this.option].delegateEvents();
                $('.list-group-item').removeClass('active');
                $('.list-list').addClass('active'); 
                $('#button-offcanvas').removeClass('hidden'); 
                this.delegateEvents();       
            },

            renderMain: function(e) {  
                var className = '.'+e.currentTarget.className.split(' ')[1]; 
                if(e.currentTarget.className.split(' ')[2] == 'active') {

                }   
                else {   
                    $('.list-group-item').removeClass('active');
                    $(className).addClass('active');
                }
                if(className == '.list-list'){
                    this.views[this.option].render();
                }
            },

            closeModal: function(e) {
                $('#sidebar .list-group-item').removeClass('active');
                $('#sidebar .list-list').addClass('active');
                $('#sidebar [type="text"]').val('');
                $('#sidebar textarea').val('');
                $('#sidebar .img_modal').attr('src', '');
                $('#sidebar .img_modal').addClass('hidden');
                $('#sidebar #modalprice').addClass('hidden');
                $('#sidebar #modalquant').addClass('hidden');
                $('#sidebar #modalgoodEmail').addClass('hidden');
                $('#sidebar #modalerrorEmail').addClass('hidden');
                $('#sidebar #modalerrorPass').addClass('hidden');                
                $('#sidebar #modalerrorRegexPass').addClass('hidden');
                $('#sidebar #modalerrorRegexEmail').addClass('hidden');
                $('#sidebar .modal-backdrop').addClass('hidden');
                $('#sidebar .select_image').val('');
                $('#sidebar [type="number"]').val('');                
                $('#sidebar [type="password"]').val('');
                $('#sidebar [type="checkbox"]').prop('checked', false);
                if(this.option == 'prod'){                    
                   this.views[this.option].clearArray();
                }
                this.passAccept = false;            
                this.passAcceptReg = false;
                this.emailAccept = false;
                this.birthAccept = false;
                this.nameAccept = false; 
                this.descAccept = false; 
                this.textAccept = false;  
                this.titleAccept = false; 
                this.priceAccept = false;
                this.quantAccept = false;
            },

            showPrev: function(ev) {
                var input = $(ev.target.files[0]),
                    nameImage = 'images/' + input[0]['name'];
                if (input) {
                    var reader = new FileReader();              
                    reader.onload = function (e) {
                        $('.img_modal').attr('src', e.target.result);
                        $('.modalimg').val(nameImage);
                        $('.img_modal').removeClass('hidden');
                    }              
                   reader.readAsDataURL(input[0]);
                }
            },

            saveModal: function(e) {
                switch(this.option) {
                    case 'user':
                        if (this.passAccept && this.passAcceptReg && this.emailAccept && this.nameAccept && this.birthAccept){
                            this.views[this.option].addFunct(1, e);
                            this.passAccept = false;
                            this.passAcceptReg  = false;
                            this.emailAccept = false;
                            this.nameAccept = false;
                            this.birthAccept = false;
                        }
                        else {                        
                            $('#modalerrorInvalid').removeClass('hidden');
                            setTimeout(this.addHidden, 2000, '#modalerrorInvalid');
                        }
                        break;
                    case 'comm':
                        if (this.nameAccept){
                            this.views[this.option].addFunct(1, e);   
                            this.nameAccept = false;
                        }
                        else {                        
                            $('#modalerrorInvalid').removeClass('hidden');
                            setTimeout(this.addHidden, 2000, '#modalerrorInvalid');
                        }
                        break;
                    case 'craft':
                        if (this.nameAccept && (this.emailAccept || $('.modalemail').val() == '')){
                            this.views[this.option].addFunct(1, e);   
                            this.emailAccept = false;
                            this.nameAccept = false;
                        }
                        else {                        
                            $('#modalerrorInvalid').removeClass('hidden');
                            setTimeout(this.addHidden, 2000, '#modalerrorInvalid');
                        }
                        break;
                    case 'cat':
                        if (this.nameAccept && this.descAccept){
                            this.views[this.option].addFunct(1, e);   
                            this.descAccept = false;
                            this.nameAccept = false;
                        }
                        else {                        
                            $('#modalerrorInvalid').removeClass('hidden');
                            setTimeout(this.addHidden, 2000, '#modalerrorInvalid');
                        }
                        break;
                    case 'mat':
                        if (this.nameAccept){
                            this.views[this.option].addFunct(1, e); 
                            this.nameAccept = false;
                        }
                        else {                        
                            $('#modalerrorInvalid').removeClass('hidden');
                            setTimeout(this.addHidden, 2000, '#modalerrorInvalid');
                        }
                        break;
                    case 'news':
                        if (this.titleAccept && this.textAccept){
                            this.views[this.option].addFunct(1, e); 
                            this.titleAccept = false;
                            this.textAccept = false;
                        }
                        else {                        
                            $('#modalerrorInvalid').removeClass('hidden');
                            setTimeout(this.addHidden, 2000, '#modalerrorInvalid');
                        }
                        break;
                    case 'prod':
                        if (this.nameAccept && this.descAccept && this.priceAccept && this.quantAccept
                            && (this.views[this.option].arrayNewCate.length>0)
                            && (this.views[this.option].arrayNewCraf.length>0) 
                            && (this.views[this.option].arrayNewMate.length>0)){
                            this.views[this.option].addFunct(1, e); 
                            this.nameAccept = false;
                            this.descAccept = false;
                            this.priceAccept = false;
                            this.quantAccept = false;
                        }
                        else {                        
                            $('#modalerrorInvalid').removeClass('hidden');
                            setTimeout(this.addHidden, 2000, '#modalerrorInvalid');
                        }
                        break;
                }
            },


            mousemove: function() {
                this.appRouter.time = new Date();
            },


            checkClicked: function(e) {
                try{this.views[this.option].modifyArray(e);}
                catch (err) { }  
                this.mousemove();              
            },

            checkNaNprice: function() {;
                if(isNaN($('.modalprice').val())){
                    $('#modalprice').removeClass('hidden');
                    $('.modalprice').val('');
                    $('.modalprice').focus();
                    setTimeout(this.addHidden, 2000, '#modalprice');
                    this.priceAccept = false;
                }
                else{
                    $('#modalprice').addClass('hidden');                    
                    this.priceAccept = true;
                }
                this.mousemove();
            },

            checkNaNquant: function() {;
                if(isNaN($('.modalquant').val())){
                    $('#modalquant').removeClass('hidden');
                    $('.modalquant').val('');
                    $('.modalquant').focus();
                    setTimeout(this.addHidden, 2000, '#modalquant');                    
                    this.quantAccept = false;
                }
                else{
                    $('#modalquant').addClass('hidden');                   
                    this.quantAccept = true;
                }
                this.mousemove();
            },

            passRegex: function(e) {
                if ($('.modalpass1').val() != ''){
                    var regex = /^((?=.*[!#$%&?_"])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!#$%&?_"]{8,}$)/;
                    if (regex.test($('.modalpass1').val())){
                        this.passAcceptReg = true;
                        $('#modalerrorRegexPass').addClass('hidden');                        
                    }
                    else {
                        this.passAcceptReg = false;                        
                        $('#modalerrorRegexPass').removeClass('hidden');
                    }
                }
                else this.passAcceptReg = false;
            },

            passChanged: function(e) {
                if (($('.modalpass1').val() != $('.modalpass2').val()) && $('.modalpass2').val() != '') {        
                    $('#modalerrorPass').removeClass('hidden');
                    this.passAccept = false;
                }
                else {
                    $('#modalerrorPass').addClass('hidden');
                    this.passAccept = true;
                }
                this.mousemove();
            },

            checkMail: function(e) {
                if ($('.modalemailUser').val() != ''){
                    var regex = /^[a-zA-Z0-9_.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}/;
                    if(regex.test($('.modalemailUser').val())){
                        var emails = EmailCollection.findWhere({email: $('.modalemailUser').val()});
                        if (typeof(emails) != 'undefined'){
                            $('#modalerrorRegexEmail').addClass('hidden');
                            $('#modalgoodEmail').addClass('hidden');
                            $('#modalerrorEmail').removeClass('hidden');
                            this.emailAccept = false;
                        }
                        else {                            
                            $('#modalerrorRegexEmail').addClass('hidden');
                            $('#modalgoodEmail').removeClass('hidden');
                            $('#modalerrorEmail').addClass('hidden');
                            this.emailAccept = true;
                        }
                    }
                    else {
                        $('#modalgoodEmail').addClass('hidden');
                        $('#modalerrorEmail').addClass('hidden');                        
                        $('#modalerrorRegexEmail').removeClass('hidden');
                        this.emailAccept = false;
                    }
                }
                else {
                    $('#modalgoodEmail').addClass('hidden');
                    $('#modalerrorEmail').addClass('hidden');
                    $('#modalerrorRegexEmail').addClass('hidden');
                    this.emailAccept = false;
                }
                this.mousemove();
            },

            checkMail2: function(e) {
                if ($('.modalemail').val() != ''){
                    var regex = /^[a-zA-Z0-9_]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}/;
                    if(regex.test($('.modalemail').val())){
                        $('#modalgoodEmail').removeClass('hidden');
                        $('#modalerrorRegexEmail').addClass('hidden');
                        this.emailAccept = true;
                    }
                    else {
                        $('#modalgoodEmail').addClass('hidden');                       
                        $('#modalerrorRegexEmail').removeClass('hidden');
                        this.emailAccept = false;
                    }
                }
                else {
                    $('#modalgoodEmail').addClass('hidden');
                    $('#modalerrorRegexEmail').addClass('hidden');
                    this.emailAccept = false;
                }
                this.mousemove();
            },

            changeName: function() {
                if ($('.modalname').val() != ''){
                    this.nameAccept = true;
                }
                else {
                    this.nameAccept = false;
                }
                this.mousemove();
            },

            changeBirth: function() {
                if ($('.modalbirth').val() != ''){
                    this.birthAccept = true;
                }
                else {
                    this.birthAccept = false;
                }
                this.mousemove();
            },

            changeDesc: function() {
                if ($('.modaldesc').val() != ''){
                    this.descAccept = true;
                }
                else {
                    this.descAccept = false;
                }
                this.mousemove();
            },
            changeText: function() {
                if ($('.modaltext').val() != ''){
                    this.textAccept = true;
                }
                else {
                    this.textAccept = false;
                }
                this.mousemove();
            },

            changeTitle: function() {
                if ($('.modaltitle').val() != ''){
                    this.titleAccept = true;
                }
                else {
                    this.titleAccept = false;
                }
                this.mousemove();
            },

            dateClicked: function(e) {
                $('.datepicker').css('position', 'fixed');
                this.mousemove();
            },

            addHidden: function(idMsg) {
              $(idMsg).addClass('hidden');
            },
            
            clear: function() {  
                if (typeof this.views[this.option] !== 'undefined') {
                    this.views[this.option].clear();
                }    
                $('.modal-backdrop').remove();
                this.$el.empty();
                this.undelegateEvents();
                this.views = {};
                $('#button-offcanvas').addClass('hidden'); 
            }

    });
    return SidebarView;
});
