// content.js
var pagination;
var loaded = false;

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === "clicked_browser_action" ) {
			if( !loaded ) {
				$('.s-result-item').each( function() {
					$(this).append('<div class="rmRow"></div>');
				});
				
				$('.rmRow').on("click", function() {
					$(this).parents('.s-result-item').remove();
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
				$(this).append('<div class="rmRow"></div>');
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