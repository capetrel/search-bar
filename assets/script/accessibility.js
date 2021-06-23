$(document).ready(function(){
    
    
    /* COOKIE CONSTRASTE */
    var myCookieContrast = getCookie("contrast");
    if (myCookieContrast == "white") {
        $("body").addClass("contrast-white");
    }else if(myCookieContrast == "black") {
        $("body").addClass("contrast-black");
    }else{
        $("body").addClass("contrast-base");
    }


    /* COOKIE TAILLE */     
    var myCookieSize = getCookie("size");
    if (myCookieSize == null) {
        $("body").addClass("size0");
        var size = 0;
    }else{
        $("body").addClass("size"+myCookieSize);
        var size = myCookieSize;
    }


    /* COOKIE TYPO */
    var myCookieTypo = getCookie("typo");
    if (myCookieTypo == "dyslexique") {
        $("body").addClass("typo-dyslexique");
    }
 

	/* Increase Text */
	$("#increase-text").click(function(){
		if(size >= 5) {
            return false;
		}else {
            size++;
            $('body').removeClass(function (index, className) {
                return (className.match (/(^|\s)size\S+/g) || []).join(' ');
            });
            $('body').addClass("size"+size);
            createCookie('size',size,7);
		}
	}); 

	/* Decrease Text */
	$("#decrease-text").click(function(){
		if(size <= 0) {
            return false;
		}else {
            size--;
            $('body').removeClass(function (index, className) {
                return (className.match (/(^|\s)size\S+/g) || []).join(' ');
            });
            $('body').addClass("size"+size);
            createCookie('size',size,7);
		}
	});

	/* Default */
	$("#normal-text").click(function(){
		$('body').removeClass(function (index, className) {
            return (className.match (/(^|\s)size\S+/g) || []).join(' ');
        });
        $('body').removeClass(function (index, className) {
            return (className.match (/(^|\s)contrast\S+/g) || []).join(' ');
        });
        $('body').removeClass("typo-dyslexique");
        $('body').addClass("contrast-base");
        $('body').addClass("size0");
        createCookie('size',0,7);
        createCookie('contrast',"base",7);
        createCookie('typo',"base",7);

        console.log("ok");
	});

	/* Contraste Noir */
	$("#contrast-b").click(function(){
		$('body').removeClass(function (index, className) {
            return (className.match (/(^|\s)contrast\S+/g) || []).join(' ');
        });
        $('body').addClass("contrast-black");
        createCookie('contrast',"black",7);
	});

	/* Contraste Blanc */
	$("#contrast-w").click(function(){
		$('body').removeClass(function (index, className) {
            return (className.match (/(^|\s)contrast\S+/g) || []).join(' ');
        });
        $('body').addClass("contrast-white");
        createCookie('contrast',"white",7);
    });


	/* Typo  */
	$("#typo").click(function(){
        $('body').addClass("typo-dyslexique");
        createCookie('typo',"dyslexique",7);
    });
     








    function createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
            document.cookie = name+"="+value+expires+"; path=/";
        }

        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

});