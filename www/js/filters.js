var cvFilters = angular.module('campviews.filters', []);

cvFilters.filter('notCheckedIn', function() {
	return function($items) { 
	var amount = $items.length;
	var items = {};
	for(i=0;i<amount;i++){
		var forms = $items[i].checkins.length - 1;
		var checkedIn = $items[i].checked_in;
		if(checkedIn < forms){
			items[i] = $items[i];
		}
	}
	
	return items;
	};
});

cvFilters.filter('checkedIn', function() {
	return function($item) {
		if($item.checked_in)
			return $item;
	};
});