// Core.js is the listing for the main services and thigns we need to make stuff happen
var $ = jQuery;

var core = {
	
	init: function() {
		
	},
	
	ajaxLoader: function(request, data, $method) {
		$.ajax({
			url: request,
			data: data,
			cache: false,
			type: $method,
			success: function(result, status, xhr){
				cache.requestedData = result;
			},
			error: function(jqXHR, textStatus, errorThrown){
				if ($.isFunction(errorCallback)) {
                    errorCallback();
                }
                else {
                    console.log('crap didnt work!');
                }
			}
		});
	},
	
	return: {
		init: init,
		ajaxLoader: ajaxLoader
	}
		
}