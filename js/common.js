$(document).ready(function() {

	$(".portfolio_item").each(function(i){
		$(this).find("a").attr("href", "#work_" + i);
		$(this).find(".port_descr").attr("id","work_" + i)
	});

	$("#portfolio_grid").mixItUp();

	$(".s_portfolio li").click(function(){
		$(".s_portfolio li").removeClass("active");
		$(this).addClass("active");
	});

	$(".popup").magnificPopup({type: "image", image: {cursor: null}});
	$(".popup_content").magnificPopup({type:"inline"});

	$(".top_text h1").animated("fadeInDown");
	$(".top_text p, .section_header").animated("fadeInUp");

	$(".animation_2").animated("fadeInLeft","fadeOutLeft");
	$(".animation_3").animated("fadeInRight","fadeOutRight");
	$(".animation_1").animated("flipInY","flipOutY");

	$(".left .resume_item").animated("fadeInLeft","fadeOutLeft");
	$(".right .resume_item").animated("fadeInRight","fadeOutRight");
	/*function heightDetect() {
		$(".main_head").css("height", $(window).height());
	};
	heightDetect();
	$(window).resize(function() {
		heightDetect();
	});*/ //changed to CSS: .main_head {height: 100vh;}

	$(".toggle_mnu").click(function() {
		$(".sandwich").toggleClass("active");
	});

	$(".mobile_mnu li a").click(function(){
		$(".top_text").removeClass("h_opacify");
		$(".mobile_mnu").fadeOut(400);
		$(".sandwich").toggleClass("active");
	}).append("<span>");

	$(".toggle_mnu").click(function(){
		if($(".mobile_mnu").is(":visible")) {
			$(".top_text").removeClass("h_opacify");
			$(".mobile_mnu").fadeOut(400);
			$(".mobile_mnu li a").removeClass("fadeInUp animated");
		} else {
			$(".top_text").addClass("h_opacify");
			$(".mobile_mnu").fadeIn(600);
			$(".mobile_mnu li a").addClass("fadeInUp animated");
		}
	});

	$("input,select,textarea").not("[type=submit]").jqBootstrapValidation();

	$(".mobile_mnu ul a").mPageScroll2id();
	$(".desktop_mnu ul a").mPageScroll2id();

});


function applyMinHeight() {
	var portfolioItems = document.querySelectorAll(".portfolio_item");
	var arr = [];

	for (var i=0;i < portfolioItems.length;i++) {
		portfolioItems[i].style.maxHeight = "";
	}
	for (var i=0;i < portfolioItems.length;i++) {
		arr.push(portfolioItems[i].clientHeight);
	}

	var minHeight = Math.min.apply(null, arr);

	for (var i=0;i < portfolioItems.length;i++) {
		portfolioItems[i].style.maxHeight = minHeight + "px";
	}
}

window.addEventListener("load", applyMinHeight);
//window.addEventListener("resize", applyMinHeight);
$(window).on("resize", applyMinHeight);

$(window).load(function() { 
	$(".loader_inner").fadeOut(); 
	$(".loader").delay(400).fadeOut("slow"); 
});


