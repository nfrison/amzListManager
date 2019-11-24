// content.js
var pagination;
var loaded = false;
var removedProducts = [];

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === "clicked_browser_action" ) {
			if( !loaded ) {
				removedProducts = JSON.parse( window.localStorage.getItem('removedProducts') );
				if( removedProducts == null ) {
					removedProducts = [];
				}
				
				$('.s-result-item').each( function() {
					if( removedProducts.indexOf( $(this).attr("data-asin") ) != -1 ) {
						$(this).remove();
					}
					$(this).find('.s-include-content-margin').append('<div class="rmRow"></div>');
				});
				
				$('.rmRow').on("click", function() {
					removedProducts.push( $(this).parents('.s-result-item').attr("data-asin") );
					window.localStorage.setItem('removedProducts', JSON.stringify(removedProducts));
					$(this).parents('.s-result-item').remove();
					console.log( removedProducts );
					console.log( JSON.parse( window.localStorage.getItem('removedProducts') ) );
				});
				
				
				pagination = $('[data-component-type="s-pagination"]').clone();
				$('[data-component-type="s-pagination"] .a-text-center').append('<a class="addResults">Carica altri risultati</a>');
				$('.a-pagination').remove();
				
				$('.addResults').on("click",function() {
					getNextResults();
				});
				
				loaded = true;
			} else {
				alert("Amazon Results List Manager già eseguito");
			}
		}
	}
);
	
function getNextResults() {
	var nextPageUrl = pagination.find('.a-selected').next('.a-normal').find('a').attr("href");
	
	$.ajax({
		url: nextPageUrl,
		dataType: 'html',
		cache: true,
		success: function(data) {
			nextPage = $(data);
			
			nextPage.find('.s-result-item').each(function() {
				$(this).find('.s-include-content-margin').append('<div class="rmRow"></div>');
				$('.s-result-list').append($(this));
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