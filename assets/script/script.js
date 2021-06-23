$( document ).ready(function() {


    /*************************************/
    /* Ajoute un fonctionnalité de Swipe sur mobile      */

    /*
    $(function() {      
        //Enable swiping...
        if($(window).width() <= 992){
            $("#main .right").swipe( {
                //Single swipe handler for left swipes
                swipeLeft:function(event, direction, distance, duration, fingerCount) {
                    window.location.replace($('#next a').attr("href"));
                },
                swipeRight:function(event, direction, distance, duration, fingerCount) {
                    window.location.replace($('#prev a').attr("href"));
                },
                //Default is 75px, set to 0 for demo so any distance triggers swipe
                threshold:200
            });
        }
    });
    */


    /*************************************/
    /* DÉPACER DES BLOCS                 */

    if ($('[class^="emplacement-"]').length){
        $('[class^="emplacement-"]').each(function(index, value) {
            var emplacement = $(this).attr("class").split("emplacement-");
            var deplacement = "deplacement-" + emplacement[1];

            if ($('.'+deplacement).length){

               // console.log($(this).html());
                $(this).html($('.'+deplacement).html());
                $('.'+deplacement).remove();
            }
        });
    }

    /*************************************/
    /* Animation du header au scroll sur mobile      */

    if($(window).width() <= 992){
        $("#accueil header").removeClass("sticky-force");
        $(window).scroll(function() {
            var scrolled = ($(document).scrollTop() >= 100);

            if (scrolled) {
                $("header").addClass("sticky");
            }else{
                $("header").removeClass("sticky");
            }
        });
    }
  

    /*************************************/
    /* FANCY BOX SUR LES BALISES OBJETS (SVG)      */
    
    $('object').each(function(index, value) {
        var src = $(this).attr("data");
        $(this).parent().before().append('<a href="'+src+'" data-fancybox="images"><img src="'+src+'" alt="" /></a>')
    });

    $('div.image, p.image').each(function(index, value) {
        /* 1er doc 
        if($(this).prev().attr("class") == "h2"){
            var titre = $(this).prev().html();
        }if($(this).prev().prev().attr("class") == "h2"){
            var titre = $(this).prev().prev().html(); 
        }
        */
        /* if($(this).prev().attr("class") == "titre-figure"){ */
        if($(this).prev().hasClass("titre-figure")){
            var titre = $(this).prev().text();
        }
        /* if($(this).prev().prev().attr("class") == "titre-figure"){ */
        if($(this).prev().prev().hasClass("titre-figure")){
            var titre = $(this).prev().prev().text(); 
        }
        var source = $(this).next(".source-graph").html();

        $(this).find("a").attr({"data-fancybox-titre": titre, "data-fancybox-source": source})
    
    });


    $('.image a').fancybox({
        'width': 1000,

        caption : function( instance, item ) {
            var titre = $(this).data('fancybox-titre') || '';
            // var legend = $(this).data('fancybox-legend') || '';
            var source = $(this).data('fancybox-source') || '';
            //var caption = "<div class='titre'>" + titre + "</div><div class='legend'>" + legend + "</div><div class='source'>" + source + "</div>";
            var caption = "<div class='titre'>" + titre + "</div><div class='source'>" + source + "</div>";

            return caption;
        }
    });


    /*************************************/
	/* MENU RESPONSIVE                   */

    if($(window).width() <= 991){
        $('body').on('click', '#main-menu #nav-icon', function (){
            $(this).toggleClass('active');
            $("#main-menu #main-menu-content").toggleClass('active');
            $("body").toggleClass('menu_open');
        });
    }

    /*************************************/
	/* MENU ACCESSIBILITÉ                */

    $('body').on('click', '#accessibility .accessibility-btn', function (){
        $(".accessibility-innner").toggleClass('active');
    });

    /*************************************/
	/* MENU PARTAGE                      */

    $('body').on('click', '#partage .partage-btn', function (){
        $(".partage-inner").slideToggle();
    });

    /*************************************/
	/* MENU PDF                          */

    $('body').on('click', '.bt-pdf a, .telecharger-btn', function (){
        $("#modal-pdf").addClass("active");
        $("body").addClass("no-overflow");
    });
    $('body').on('click', '#modal-pdf.active #modal-bg', function (){
        $("#modal-pdf").removeClass("active");
        $("body").removeClass("no-overflow");
    });


    /*************************************/
	/* MODAL PDF                         */

    $('body').on('click', '.liste-pdf .category', function (){
        if($(this).parent().hasClass("active")){
            $(".liste-pdf > li").removeClass("active");
        }else{
            $(".liste-pdf > li").removeClass("active");
            $(this).parent().addClass("active");
        }
    }); 





    /*************************************/
	/* MENU WEB LIVRE PDF                */


    var page_active = $("body").attr("id");

    /* Détecte si on est sur une page ou une catégorie via la class sur le body */
    if(page_active.startsWith("liseuse")){
        $("#main .bouton-left-col .bt-liseuse").addClass("active");
    }

    if(page_active.startsWith("page") || page_active.startsWith("category")){
        $("#main .bouton-left-col .bt-web").addClass("active");
    }



    /*************************************/
	/* BOUTON RECHERCHE                  */

    // $('body').on('click', '.bt-recherche', function (){
    //     $("#search").slideToggle();
    // });


    /*************************************/
    /* TABLEAU RESPONSIVE                */
    
    $('table').each(function(index, value) {
        $(this).wrap("<div class='tableau-responsive'></div>");
    });






    /*************************************/
    /* PREV NEXT                         */
    
    var page_active = $("body").attr("id");
    var page_type = "";

    var tabLink = [];
    var positionLink = 0;
    var totalLink = 0;

    /* Détecte si on est sur une page ou une catégorie via la class sur le body */
    if(page_active.startsWith("category")){
        page_type = "category";
    }

    if(page_active.startsWith("page")){
        page_type = "page";
    }

     /* Sur chacun des liens du menu */
     $('#main-menu-content li a').each(function(index, value){
        var url = $(this).attr("href");

        tabLink.push(url);
        totalLink = index;
        
        /* Vérifie si l'ID du lien correspond à l'ID du body */
        if($(this).attr("id") == "lien-"+page_active){
            positionLink = index;
            if(page_type == "category"){
                // ajoute une class active sur le lien et la catégorie
                $(this).addClass("active");
                $(this).parent().addClass("active"); 
            }

            else if(page_type == "page"){
                $(this).addClass("active");
                $(this).parents(".li-niv-1").addClass("active"); 
            }
        }
    });

    // Ajout du lien précédent (si ce n'est pas la première page)
    if(positionLink != 0){
        $("#prev-next #prev a").attr("href", tabLink[positionLink-1]).addClass("show");
    }
     // Ajout du lien suivant (si ce n'est pas la dernière page)
    if(positionLink != totalLink){
        $("#prev-next #next a").attr("href", tabLink[positionLink+1]).addClass("show");
    }


    /********************************************/
    /* OUVERTURE DE LA BONNE PAGE DE LA LISEUSE */

    if ($('#liseuse-page').length){
        // Récupérer les arguments d'une URL
        var url = window.location.href.slice(0,window.location.href.indexOf('html')+4);
                        

        function getUrlVars()   {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

            for(var i = 0; i < hashes.length; i++){
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            $("#iframe-liseuse").attr("src", "./liseuse/index.php#p="+vars['page']);
        }
        getUrlVars();
    }

    /*************************************/
    /* MENU AUTO SCROLL                  */
    /*
    if ($('#main-menu .menu-wrapper .active').length){
        var container = $('#main-menu .menu-wrapper')
        var scrollTo = $('#main-menu .menu-wrapper .active');
        container.animate({
            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
        }, 0);
    }
    */




    /*************************************/
	/* TABLEAU RESPONSIVE                */

    if ($('.tableau-responsive').length){
        $('.tableau-responsive').each(function(index, value) {
            var size_tab_container = $(this).width();
            var size_tab = $(this).find("table").width();
            if(size_tab > size_tab_container){
                $(this).addClass("tableau-scroll-container");
                $(this).wrapInner("<div class='tableau-scroll'></div>");
                $(this).append("<div class='icon-scroll-container'><div class='icon-scroll'><div/><div/>");
            }
        });
    }




    /*************************************/
	/* EFFET HOVER SUR LES PHOTOS ET GRAPHIQUE */

    if ($('.lien-photo').length){
        $('.lien-photo').each(function(index, value) {
            var classNumCarte = $(this).attr('class').split('lien-carte')[1];
            var classNumGraphique = $(this).attr('class').split('lien-graphique')[1];

            if (typeof classNumCarte  !== "undefined"){
                var imageCorrespondanteCarte = $(".titre-carte"+classNumCarte).parent().next().find("img").attr("src");
                $(this).append("<div class='lien-hover'><img src='"+imageCorrespondanteCarte+"'></div>");
                $(this).wrap("<a href='#ancre-photo"+classNumCarte+"'></a>");
            }
            if (typeof classNumGraphique  !== "undefined"){
                var imageCorrespondanteGraphique = $(".titre-graphique"+classNumGraphique).parent().next().find("img").attr("src");
                $(this).append("<div class='lien-hover'><img src='"+imageCorrespondanteGraphique+"'></div>");
                $(this).wrap("<a href='#ancre-graphique"+classNumGraphique+"'></a>");
            }
        });
    }  

    if ($('.titre-figure').length){
        $('.titre-figure').each(function(index, value) {
            var classNumCarte = $(this).attr('class').split('titre-carte')[1];
            var classNumGraphique = $(this).attr('class').split('titre-graphique')[1];
            if (typeof classNumCarte  !== "undefined"){
                $(this).wrap("<span id='ancre-photo"+classNumCarte+"' class='ancre-photo'></span>"); 
            }
            if (typeof classNumGraphique  !== "undefined"){
                $(this).wrap("<span id='ancre-graphique"+classNumGraphique+"' class='ancre-graphique'></span>"); 
            }
        });
    }   


    /*************************************/
	/* ANCRE SUR LES TABLEAUX            */


    if ($('.ancre-tableau').length){
        $('.ancre-tableau').each(function(index, value) {
            var classNum = $(this).attr('class').split('ancre-tableau ancre-tableau')[1];
           $(this).wrap("<div id='ancre-tableau"+classNum+"' class='ancre-titre'></div>");
        });
    }  


    if ($('.lien-tableau').length){
        $('.lien-tableau').each(function(index, value) {
            var classNum = $(this).attr('class').split('lien-tableau lien-tableau')[1];
            $(this).wrap("<a href='#ancre-tableau"+classNum+"'></a>");
        });
    }  




    /*************************************/
	/* LIEN EXTERNE                      */

    if ($('.lien-note-bas-de-page').length){
        $('.lien-note-bas-de-page').each(function(index, value) {
            $(this).parent().attr("target", "_blank");
        });
    } 



});