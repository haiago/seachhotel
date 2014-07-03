/**
 * @name Site
 * @description Define global variables and functions
 * @version 1.0
 */
var AddServer = "http://haihuynh.vn.ae";
var Site = (function($, window, undefined) {
  //load danh muc
  function loadCatagories() {
    // todo
    var homePage = $('.home-page');
    var header = $('.header');
    $.ajax({
      url: AddServer + "/api.php?op=catagories",
      type: "GET",
      
      success: function(data){
        window.localStorage.setItem('catagories', data);
        data = jQuery.parseJSON(data);
        $.each(data.catagories, function( i, catagory ) {
          homePage.find('#catagories').append('<option value="'+ catagory.id +'">'+ catagory.title +'</option>');
          header.find('#headercat').append('<li><a href="" data-transition="fade" data-cat="'+catagory.id+'">'+ catagory.title +'</a></li>');
        });
        var itemNav = $('#headercat').find('a');
        itemNav.each(function() {
          $(this).off('click').on('click', function(event) {
            var that = this;
            event.preventDefault();
            $.ajax({
              url: AddServer + "/api.php?op=search&idCat="+ $(that).data('cat'),
              type: 'GET',
              
              success: function(data){
                window.localStorage.setItem('search', data);
                window.location.href = 'catagories.html';         
              }            
            });            
          });
        });
      }
    });
  }


  //load tinh / thanh pho
  function loadProvince() {
    // todo
    var homePage = $('.home-page');
    $.ajax({
      url: AddServer + "/api.php?op=province",
      type: "GET",
      
      success: function(data){
        window.localStorage.setItem('province', data);
        data = jQuery.parseJSON(data);
        $.each(data.province, function( i, provinces ) {
          homePage.find('#province').append('<option id="chooseprovince" value="'+ provinces.id +'">'+ provinces.title +'</option>');
        });
      }
    });
  }

  //load Quan / huyen khi click tinh
  // function loadDistrict() {
  //   // todo
  //   var homePage = $('.home-page');
  //   $('#province').on('click', function(event) {
  //     event.preventDefault();
  //     var province = $('#province').val();
  //     if(province === '0'){
  //       homePage.find('#district').children().remove();
  //       homePage.find('#district').append('<option value="0">Quận / Huyện</option>');
  //     }else{
  //       $.ajax({
  //         url: AddServer + "/api.php?op=district&idProvince="+ province,
  //         type: "GET",
          
  //         success: function(data){
  //           window.localStorage.setItem('district', data);
  //           data = jQuery.parseJSON(data);
  //           homePage.find('#district').children().remove();
  //           $.each(data.loaddistrict, function( i, districts ) {
  //             homePage.find('#district').append('<option value="'+ districts.id +'">'+ districts.title +'</option>');
  //           });
  //         }
  //       });
  //     }
  //   });
  // }
  function loadDistrict() {
    // todo
    var homePage = $('.home-page');
    $.ajax({
      url: AddServer + "/api.php?op=district",
      type: "GET",
      
      success: function(data){
        window.localStorage.setItem('district', data);
        data = jQuery.parseJSON(data);
        $.each(data.loaddistrict, function( i, districts ) {
          homePage.find('#district').append('<option value="'+ districts.id +'">'+ districts.title +'</option>');
        });
      }
    });
  }

  //load the loai
  function loadResultcat() {
    // todo
    var resultCat = $('.resultcat');
    var resultsearch = window.localStorage.getItem('search');
    resultsearch = jQuery.parseJSON(resultsearch);
    resultCat.find('h2').append('<marquee direction="Left">'+ resultsearch.titlecat +'</marquee>');
    $.each(resultsearch.result, function( i, resr ) {
      resultCat.find('.list-product').append(
        '<li><a href="" data-pro="'+resr.id+'">' +
        '<div class="col-xs-4"><img src="'+AddServer + '/' +resr.image+'" alt="photo" class="img-responsive"></div>' +
        '<div class="col-xs-8 font-small">' +
          '<span class="titlepro"><strong>'+ resr.title +'</strong></span><span class="address">'+ resr.address +', '+ resr.district +', '+ resr.province +'</span><span class="address">'+ resr.email +'</span><span class="address">'+ resr.phone +'</span>' +
        '</div>'+
        '<span class="iconnew"><img src="images/icon1.gif"></span>'+
        '</a></li>'
      );
    });
    resultCat.find('.view').append('<a id="continues" href="" data-cat="'+resultsearch.id_cat+'"> Xem thêm <span class="glyphicon glyphicon-circle-arrow-down"></span></a>');
    var idPro = $('.list-product').find('a');
    //console.log(idPro);
    idPro.each(function(index, el) {
      $(this).on('click', function(event){
        event.preventDefault();
        var idPro = $(this).data('pro');
        window.localStorage.setItem('idPro', idPro);
        $.ajax({
          url: AddServer + "/api.php?op=detailpro&id=" + idPro,
          type: "GET",

          success: function(data){
            window.localStorage.setItem('detailpro', data);
            $.ajax({
              url: AddServer + "/api.php?op=visit&id=" + idPro,
              type: "GET",

              success: function(data){
                window.localStorage.setItem('visit', data);
              }
            });
            $('body').animate({
              marginLeft: - $(window).width(),
              position: 'relative',
              width: $(window).width(),
              opacity: 0
            }, 1000, function(){
              window.location.href = 'content-product.html';              
            });
          }
        });
      });
    });

    //load them san pham khi click nut them
    var loadItem = 3;
    $('#continues').on('click', function(event) {    
      event.preventDefault();
      loadItem = loadItem + 1;
      // alert(loadItem);
      $.ajax({
        url: AddServer + '/api.php?op=search&idCat='+ $(this).data('cat') + '&limit='+loadItem,
        
        success: function (data) {
          window.localStorage.setItem('search',data);
          var resultsearch = window.localStorage.getItem('search');
          resultsearch = jQuery.parseJSON(resultsearch);
          resultCat.find('.list-product').children().remove();
          $.each(resultsearch.result, function( i, resr ) {            
            resultCat.find('.list-product').append(
              '<li><a href="" data-pro="'+resr.id+'">' +
              '<div class="col-xs-4"><img src="'+AddServer + '/' +resr.image+'" alt="photo" class="img-responsive"></div>' +
              '<div class="col-xs-8 font-small">' +
                '<span class="titlepro"><strong>'+ resr.title +'</strong></span><span class="address">'+ resr.address +', '+ resr.district +', '+ resr.province +'</span><span class="address">'+ resr.email +'</span><span class="address">'+ resr.phone +'</span>' +
              '</div>'+
              '<span class="iconnew"><img src="images/icon1.gif"></span>'+
            '</a></li>'
            );
          });
        }
      });
    });
  }

  //load noi dung
  function loadContent() {
    // todo
    var showDetail = $('.contentpro');
    var contentPro = window.localStorage.getItem('detailpro');
    contentPro = jQuery.parseJSON(contentPro); 
    $.each(contentPro.detailpro, function( i, conpro ) {
      showDetail.find('.content-product').append(
        '<li>' +
        '<div class="col-xs-4"><img src="'+AddServer + '/' +conpro.image+'" alt="photo" class="img-responsive"></div>' +
        '<div class="col-xs-8 font-small">' +
        '<span class="titlepro"><strong>'+ conpro.title +'</strong></span><span class="address">'+ conpro.address +', '+ conpro.district +', '+ conpro.province +'</span><span class="address">'+ conpro.email +'</span><span class="address">'+ conpro.phone +'</span>' +
        '</div>'+
        '</li>'
      );
      showDetail.find('.desc').append('<span>Giới thiệu: ( <label>Lượt xem:</label> <span>'+contentPro.visit+'</span> )</span>');
      showDetail.find('.description').html(conpro.description);
      showDetail.find('.wi-cont').append(
        '<li><ul><li><img src="images/image.png"></li><li><a id="photo-pro" href="">Hình ảnh</a></li></ul></li>'+
          '<li><ul><li><img src="images/openofficeorg-20-writer.png"></li><li><a id="cat-menu-pro" href="">Thực đơn</a></li></ul></li>'+
          '<li><ul><li><img src="images/internet.png"></li><li><a id="map" href="">Bản đồ</a></li></ul></li>'+
          '<li><ul><li><img src="images/kopete.png"></li><li><a id="new-pro" href="">Tin tức</a></li></ul></li>'+
          '<li><ul><li><img src="images/phone-icon.png"></li><li><a id="contact" href="">Liên hệ</a></li></ul></li>'
      );
    });
    //load hinh anh
    $('#photo-pro').on('click', function(event) {
      event.preventDefault();
      $.ajax({
        url: AddServer + '/api.php?op=photopro&id=' + window.localStorage.getItem('idPro'),
        
        success: function(data){
          window.localStorage.setItem('photopro', data);
          $('body').animate({
            marginLeft: - $(window).width(),
            position: 'relative',
            width: $(window).width(),
            opacity: 0
          }, 1000, function(){
            window.location.href = 'photo-product.html';
          });
        }
      });      
    });
    // load loai thuc don
    $('#cat-menu-pro').on('click', function(event) {
      event.preventDefault();
      $.ajax({
        url: AddServer + '/api.php?op=catmenupro&id=' + window.localStorage.getItem('idPro'),
        
        success: function(data){
          window.localStorage.setItem('catmenupro', data);
          $('body').animate({
            marginLeft: - $(window).width(),
            position: 'relative',
            width: $(window).width(),
            opacity: 0
          }, 1000, function(){
            window.location.href = 'cat-menu-product.html';
          });    
        }
      });      
    });
    //load ban do
    $('#map').on('click', function(event) {
      event.preventDefault();
      $('body').animate({
        marginLeft: - $(window).width(),
        position: 'relative',
        width: $(window).width(),
        opacity: 0
      }, 1000, function(){
        window.location.href = 'map.html';  
      });   
    });
    //load tin tuc
    $('#new-pro').on('click', function(event) {
      event.preventDefault();
      $.ajax({
        url: AddServer + '/api.php?op=newspro&id=' + window.localStorage.getItem('idPro'),
        
        success: function(data){
          window.localStorage.setItem('newspro', data);
          $('body').animate({
            marginLeft: - $(window).width(),
            position: 'relative',
            width: $(window).width(),
            opacity: 0
          }, 1000, function(){
            window.location.href = 'news-product.html';
          });
        }
      });      
    });
    // load noi dung lien he
    $('#contact').on('click', function(event) {
      event.preventDefault();
      $.ajax({
        url: AddServer + '/api.php?op=contact&id=' + window.localStorage.getItem('idPro'),
        
        success: function(data){
          window.localStorage.setItem('contact', data);
          $('body').animate({
            marginLeft: - $(window).width(),
            position: 'relative',
            width: $(window).width(),
            opacity: 0
          }, 1000, function(){
            window.location.href = 'contact.html';
          });
        }
      });      
    });
  }

  //load hinh anh
  function loadPhoto() {
    // todo
    var showPhoto = $('.showphoto');
    var PhotoPro = window.localStorage.getItem('photopro');
    PhotoPro = jQuery.parseJSON(PhotoPro); 
    $.each(PhotoPro.photopro, function( i, photo ) {
      showPhoto.find('.photo ul').append(
        '<li class="col-xs-4 col-sm-4"><div><a id="image-large" href="" data-idphoto="'+photo.id+'"><img src="'+AddServer + '/' +photo.path+'" alt=""></a></div>'+
          '<label>'+photo.title+'</label>'+
        '</li>'
      );
    });
    var idPhoto = $('.photo ul').find('a');
    //console.log(idPro);
    idPhoto.each(function(index, el) {
      $(this).on('click', function(event){
        event.preventDefault();
        var idPhoto = $(this).data('idphoto');
        window.localStorage.setItem('idPhoto', idPhoto);
        $.ajax({
          url: AddServer + "/api.php?op=imagelarge&idphoto=" + idPhoto,
          type: "GET",

          success: function(data){
            window.localStorage.setItem('imagelarge', data);
            $('body').animate({
              marginLeft: - $(window).width(),
              position: 'relative',
              width: $(window).width(),
              opacity: 0
            }, 1000, function(){
              window.location.href = 'image-large.html';
            });
          }
        });
      });
    });
  }

  //load hinh anh dung voi kich thuoc ban dau
  function loadImageLarge() {
    // todo
    var showimagelarge = $('.showimagelarge');
    var ImageLarge = window.localStorage.getItem('imagelarge');
    ImageLarge = jQuery.parseJSON(ImageLarge); 
    showimagelarge.find('h2').append(
        '<marquee direction="Left">'+ImageLarge.title+'</marquee>'
      );
    showimagelarge.find('.large').append(
        '<img src="'+AddServer + '/' +ImageLarge.image_large+'" alt="">'
      );
  }

  //load catagories menu product
  function loadCatMenuProduct() {
    // todo
    var showCatMenu = $('.catmenupro');
    var detailCatMenu = window.localStorage.getItem('catmenupro');
    detailCatMenu = jQuery.parseJSON(detailCatMenu); 
    $.each(detailCatMenu.catmenu, function( i, catmn ) {
      showCatMenu.find('.cat-wi').append(
        '<ul class="cat-wi-1">'+
         '<li><span>'+ catmn.title +'</span></li>'+
         '<li><a href="" data-catmenu="'+catmn.id+'"><span class="glyphicon glyphicon-circle-arrow-right"></span></a></li>'+
        '</ul>'
      );
    });
    //lay id cua cat menu product
    var idCatMenu = $('.cat-wi-1 li').find('a');
    //console.log(idPro);
    idCatMenu.each(function(index, el) {
      $(this).on('click', function(event){
        event.preventDefault();
        var that = this;
        $.ajax({
          url: AddServer + "/api.php?op=menupro&idCatMenu=" + $(that).data('catmenu') +"&idPro=" + window.localStorage.getItem('idPro'),
          
          success: function(data){
            window.localStorage.setItem('menupro', data);
            $.ajax({
              url: AddServer + "/api.php?op=totalmoney&idCatMenu=" + $(that).data('catmenu') +"&idPro=" + window.localStorage.getItem('idPro'),
              
              success: function(data){
                window.localStorage.setItem('totalmoney', data);
              }
            });
            $('body').animate({
              marginLeft: - $(window).width(),
              position: 'relative',
              width: $(window).width(),
              opacity: 0
            }, 1000, function(){
              window.location.href = 'menu-product.html';
            });
          }
        });
      });
    });
  }

  //load menu product
  function loadMenuProduct() {
    // todo
    var showMenu = $('.menupro');
    var MenuPro = window.localStorage.getItem('menupro');
    var total = window.localStorage.getItem('totalmoney');
    MenuPro = jQuery.parseJSON(MenuPro); 
    total = jQuery.parseJSON(total);
    showMenu.find('h2').append(
        '<marquee direction="Left">'+MenuPro.titlecat+'</marquee>'
      );
    $.each(MenuPro.menupro, function( i, mnpro ) {
      showMenu.find('.form-menu').append(
        '<tr class="third-menu"><td>'+mnpro.title+'</td>'+
        '<td>'+mnpro.price+' vnd</td></tr>'
      );
    });
    $.each(total.totalmoney, function( i, totals ) {
      showMenu.find('.form-total').append(
        '<tr class="third-menu"><td>Tổng tiền</td>'+
        '<td>'+totals.total+' vnd</td></tr>'
      );
    });
  }

  //load tat ca tin tuc
  function loadNewsProduct() {
    // todo
    var showNews = $('.show-news');
    var detailNews = window.localStorage.getItem('newspro');
    detailNews = jQuery.parseJSON(detailNews); 
    $.each(detailNews.newspro, function( i, news ) {
      showNews.find('.newpro-result').append(
        '<li><a href="" data-news="'+news.id+'"><strong>'+news.title+'</strong></a><span>Ngày đăng: '+news.datenews+'</span>'+
        '<span><img src="images/new_6.gif"></span>'+
        '<a href="" data-news="'+news.id+'"><span class="glyphicon glyphicon-circle-arrow-right"></span></a></li>'
      );
    });
    //lay id cua cat menu product
    var idNews = $('.newpro-result li').find('a');
    //console.log(idPro);
    idNews.each(function(index, el) {
      $(this).on('click', function(event){
        var that = this;
        event.preventDefault();
        $.ajax({
          url: AddServer + "/api.php?op=contentnewspro&idNews=" + $(that).data('news') +"&idPro=" + window.localStorage.getItem('idPro') +"",
          
          success: function(data){
            window.localStorage.setItem('contentnewspro', data);
            $('body').animate({
              marginLeft: - $(window).width(),
              position: 'relative',
              width: $(window).width(),
              opacity: 0
            }, 1000, function(){
              window.location.href = 'content-news-product.html';
            });
          }
        });
      });
    });
  }

  //load noi dung tin tuc
  function loadContentNews() {
    // todo
    var showContentNews = $('.content-news');
    var contentNewsPro = window.localStorage.getItem('contentnewspro');
    contentNewsPro = jQuery.parseJSON(contentNewsPro); 
    $.each(contentNewsPro.contentnewspro, function( i, contentnews ) {
      showContentNews.find('h2').append(
        '<marquee direction="Left">'+contentnews.title+'</marquee>'
      );
      showContentNews.find('.description').html(contentnews.description);
    });
  }

  //load lien he
  function loadContact() {
    // todo
    var showContact = $('.showcontact');
    var ContactPro = window.localStorage.getItem('contact');
    ContactPro = jQuery.parseJSON(ContactPro); 
    $.each(ContactPro.contact, function( i, cta ) {
      showContact.find('.content-contact ul').append(
        '<li><span>'+cta.title+'</span></li>'+
        '<li>'+cta.address+', '+cta.district+', '+cta.province+'</li>'+
        '<li>'+cta.email+'</li>'+
        '<li>'+cta.phone+'</li>'
      );
    });
  }


  //load hinh anh trang homepage
  // function slideshow() {
  //   var imgs = [
  //     'images/home-page.jpg',
  //     'images/home-page2.jpg',
  //     'images/home-page3.jpg',
  //     'images/home-page4.jpg',
  //     'images/home-page5.jpg'];
  //     var cnt = imgs.length;
  //   $(function(){
  //     setInterval(Slider, 4000);
  //     var $imageSlide = $('img[id$=imageSlide]');
  //     // set the image control to the last image
  //     $imageSlide.attr('src', imgs[cnt - 1]);
  //   });
  //   function Slider() {
  //     $('#imageSlide').fadeOut("slow", function () {
  //         $(this).attr('src', imgs[(imgs.length++) % cnt]).fadeIn("slow");
  //     });
  //   }
  // }
  return {
    loadCatagories: loadCatagories,
    loadProvince: loadProvince,
    loadDistrict: loadDistrict,
    loadResultcat: loadResultcat,
    loadContent: loadContent,
    loadPhoto: loadPhoto,
    loadCatMenuProduct: loadCatMenuProduct,
    loadMenuProduct: loadMenuProduct,
    loadNewsProduct: loadNewsProduct,
    loadContentNews: loadContentNews,
    loadContact: loadContact,
    loadImageLarge: loadImageLarge
    // slideshow: slideshow
  };

})(jQuery, window);

jQuery(function() {
  Site.loadCatagories();
  Site.loadProvince();
  Site.loadDistrict();

  $(window).load(function(){
    $('body').fadeIn(800);
  });
  // if($('.slideshow').length){
  //   Site.slideshow();
  // }
  if($('.resultcat').length){
    Site.loadResultcat();
  }
  if($('.showphoto').length){
    Site.loadPhoto();
  }
  if($('.catmenupro').length){
    Site.loadCatMenuProduct();
  }
  if($('.menupro').length){
    Site.loadMenuProduct();
  }
  if($('.show-news').length){
    Site.loadNewsProduct();
  }
  if($('.content-news').length){
    Site.loadContentNews();
  }
  if($('.contentpro').length){
    Site.loadContent();
  }
  if($('.showcontact').length){
    Site.loadContact();
  }
  if($('.showimagelarge').length){
    Site.loadImageLarge();
  }

  //danh muc
  if($('.home-page').length){
    var homePage = $('.home-page');
    homePage.find('form #submit').on('click', function(event) {
      event.preventDefault();
      var keySearch = $('#keysearch').val();
      var catagories = $('#catagories').val();
      var province = $('#province').val();
      var district = $('#district').val();
      $.ajax({
        url: AddServer + "/api.php?op=search&keysearch="+ keySearch +"&idCat="+ catagories +"&idProvince="+ province +"&idDistrict="+ district +"",
        type: 'GET',
        
        success: function(data){
          window.localStorage.setItem('search', data);
          $('body').animate({
            marginLeft: - $(window).width(),
            position: 'relative',
            width: $(window).width(),
            opacity: 0
          }, 1000, function(){
            window.location.href = 'show-search.html'; 
          });
        }
      });
    });
  }

  if($('.ShowSearch').length){
    var showSearch = $('.ShowSearch');
    var resultsearch = window.localStorage.getItem('search');
    resultsearch = jQuery.parseJSON(resultsearch); 
    $.each(resultsearch.result, function( i, resr ) {
      showSearch.find('.list-product').append(
        '<li><a href="" data-pro="'+resr.id+'">' +
        '<div class="col-xs-4"><img src="'+AddServer + '/' +resr.image+'" alt="photo" class="img-responsive"></div>' +
        '<div class="col-xs-8 font-small">' +
          '<span class="titlepro"><strong>'+ resr.title +'</strong></span><span class="address">'+ resr.address +', '+ resr.district +', '+ resr.province +'</span><span class="address">'+ resr.email +'</span><span class="address">'+ resr.phone +'</span>' +
        '</div>'+
        '<span class="iconnew"><img src="images/icon1.gif"></span>'+
        '</a></li>'
      );
    });
    // showSearch.find('.view').append('<a id="continues" href="" data-cat="'+catagories+'" data-province="'+province+'" data-district="'+district+'"> Xem thêm</a>');         
    showSearch.find('.view').append('<a id="continues" href="" data-cat="'+resultsearch.id_cat+'" data-province="'+resultsearch.idprovince+'" data-district="'+resultsearch.iddistrict+'" data-keywords="'+resultsearch.keywords+'"> Xem thêm <span class="glyphicon glyphicon-circle-arrow-down"></span></a>');
    var idPro = $('.list-product').find('a');
    //console.log(idPro);
    idPro.each(function(index, el) {
      $(this).on('click', function(event){
        event.preventDefault();
        var idPro = $(this).data('pro');
        window.localStorage.setItem('idPro', idPro);
        $.ajax({
          url: AddServer + "/api.php?op=detailpro&id=" + idPro,
          type: "GET",

          success: function(data){
            window.localStorage.setItem('detailpro', data);
            $.ajax({
              url: AddServer + "/api.php?op=visit&id=" + idPro,
              type: "GET",

              success: function(data){
                window.localStorage.setItem('visit', data);
              }
            });
            $('body').animate({
              marginLeft: - $(window).width(),
              position: 'relative',
              width: $(window).width(),
              opacity: 0
            }, 1000, function(){
              window.location.href = 'content-product.html';
            });
          }
        });
      });
    });

    //load them san pham khi click nut them
    var loadItem = 3;
    $('#continues').on('click', function(event) {    
      event.preventDefault();
      loadItem = loadItem + 1;
      // alert(loadItem);
      $.ajax({
        url: AddServer + '/api.php?op=search&idCat='+ $(this).data('cat') + 
        '&idProvince='+ $(this).data('province') + '&idDistrict='+ $(this).data('district') +
        '&keysearch='+ $(this).data('keywords') + 
        '&limit='+loadItem,
        
        success: function (data) {
          window.localStorage.setItem('search',data);
          var resultsearch = window.localStorage.getItem('search');
          resultsearch = jQuery.parseJSON(resultsearch);
          showSearch.find('.list-product').children().remove();
          $.each(resultsearch.result, function( i, resr ) {
            showSearch.find('.list-product').append(
              '<li><a href="" data-pro="'+resr.id+'">' +
              '<div class="col-xs-4"><img src="'+AddServer + '/' +resr.image+'" alt="photo" class="img-responsive"></div>' +
              '<div class="col-xs-8 font-small">' +
                '<span class="titlepro"><strong>'+ resr.title +'</strong></span><span class="address">'+ resr.address +', '+ resr.district +', '+ resr.province +'</span><span class="address">'+ resr.email +'</span><span class="address">'+ resr.phone +'</span>' +
              '</div>'+
              '<span class="iconnew"><img src="images/icon1.gif"></span>'+
            '</a></li>'
            );
          });
        }
      });
    });                          
  }

  // button back
  var btnBack = $('#btnback');
  btnBack.each(function(index, el) {
    $(this).off('click').on('click', function(event) {
      event.preventDefault();
      $('body').animate({
        marginLeft: $(window).width(),
        position: 'relative',
        width: $(window).width()
      }, 1000, function(){
        window.history.back();
      });
    });
  });

  //load ban do duong di
  if($('#map-canvas').length){
    var map;
    var pos;
    
    google.maps.event.addDomListener(window, 'load', function(){
      var flightPlanCoordinates = [];
      var geocoder = new google.maps.Geocoder();

      var resultsearch = window.localStorage.getItem('detailpro');
      resultsearch = jQuery.parseJSON(resultsearch); 
      //alert(resultsearch.result[0].address);
      geocoder.geocode( { 'address': resultsearch.detailpro[0].address + resultsearch.detailpro[0].district + resultsearch.detailpro[0].province}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          // flightPlanCoordinates.push(results[0].geometry.location);
          var contentAddress= '<div id="content-marker">'+
                              '<h2 class="firstHeading">'+resultsearch.detailpro[0].title+'</h2>'+
                              '<div id="bodyContent">'+
                              '<p>'+resultsearch.detailpro[0].address + '</br>' +
                              resultsearch.detailpro[0].district +  ',' +
                              resultsearch.detailpro[0].province+'</p>'+
                              '</div>'+
                              '</div>';
          var infowindow = new google.maps.InfoWindow({
            content: contentAddress
          });
          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
          });
          infowindow.open(map,marker);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });

      var mapOptions = {
        zoom: 15
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      // lay vi tri hien tai
      // if(navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(function(position) {
      //     pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //     flightPlanCoordinates.push(pos);
      //     map.setCenter(pos);
      //     var marker = new google.maps.Marker({
      //         position: pos,
      //         map: map
      //     });
      //   },
      //   function(){ }, 
      //   {
      //     enableHighAccuracy: true
      //   });
      // }

      // var flightPath = new google.maps.Polyline({
      //   path: flightPlanCoordinates,
      //   geodesic: true,
      //   strokeColor: '#FF0000',
      //   strokeOpacity: 1.0,
      //   strokeWeight: 2
      // });

      // flightPath.setMap(map);
    });  
  }
});

/**
 *  @name plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  var pluginName = 'plugin';
  var privateVar = null;
  var privateMethod = function() {

  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {

    },
    publicMethod: function(params) {

    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    option: 'value'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
