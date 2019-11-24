// content.js
var pagination;
var removedProducts = [];

if( window.localStorage.getItem("active") != null ) {
	removedProducts = JSON.parse( window.localStorage.getItem("removedProducts") );
	
	$('.s-result-item').each( function() {
		if( removedProducts.indexOf( $(this).attr("data-asin") ) != -1 ) {
			$(this).remove();
		}
	});
	
	init();
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.type === "activate" ) {
			if( window.localStorage.getItem("active") == null  ) {
				removedProducts = [];
				window.localStorage.setItem("removedProducts", JSON.stringify(removedProducts) );
				
				init();
				
				window.localStorage.setItem("active",true);
			} else {
				alert("Amazon Results List Manager already activated");
			}
		} else if( request.type === "reset" ) {
			if( window.localStorage.getItem("active") != null ) {
				removedProducts = [];
				window.localStorage.setItem("removedProducts", JSON.stringify(removedProducts) );
				alert("Removed products resetted.\nPlease reload your page for these changes to take effect");
			} else {
				alert("Amazon Results List Manager not activated");
			}
		}
	}
);

function init() {
	// append "rmRow" in the end of each ".s-result-item"
	$('.s-result-item').each( function() {
		$(this).append('<div class="rmRow"></div>');
	});
	
	$('.rmRow').on("click", function() {
		removedProducts.push( $(this).parents('.s-result-item').attr("data-asin") );
		window.localStorage.setItem('removedProducts', JSON.stringify(removedProducts));
		$(this).parents('.s-result-item').remove();
	});
	
	// replace "change page" with "Load more results"
	pagination = $('[data-component-type="s-pagination"]').clone();
	$('[data-component-type="s-pagination"] .a-text-center').append('<a class="addResults">Load more results</a>');
	$('.a-pagination').remove();
	
	$('.addResults').on("click",function() {
		getNextResults();
	});
}
	
function getNextResults() {
	var nextPageUrl = pagination.find('.a-selected').next('.a-normal').find('a').attr("href");
	
	$.ajax({
		url: nextPageUrl,
		dataType: 'html',
		cache: true,
		success: function(data) {
			nextPage = $(data);
			
			nextPage.find('.s-result-item').each(function() {
				if( removedProducts.indexOf( $(this).attr("data-asin") ) != -1 ) {
					$(this).remove();
				} else {
					$(this).append('<div class="rmRow"></div>');
					$('.s-result-list').append($(this));
				}
			});
			
			$('.rmRow').on("click", function() {
				$(this).parents('.s-result-item').remove();
			});
			
			pagination = nextPage.find('[data-component-type="s-pagination"]');
		},
		error: function(xhr, resp, text) {
			console.log(xhr, resp, text);
		}
	});
}