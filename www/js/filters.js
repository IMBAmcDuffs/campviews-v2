var cvFilters = angular.module('campviews.filters', []);

cvFilters.filter('notCheckedIn', function() {
	return function($item) { 
		if(!$item.checked_in)
			return $item;
	};
});

cvFilters.filter('checkedIn', function() {
	return function($item) {
		if($item.checked_in)
			return $item;
	};
});