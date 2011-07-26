(function(){
	window.AppUtils = {};

	var dateFormat = new enyo.g11n.DateFmt({date: "short", dateComponents: "dm"});
	AppUtils.formatDate = function(timestamp){
		var d = new Date(timestamp * 1000);
		return dateFormat.format(d);
	}
	var longDateFormat = new enyo.g11n.DateFmt({date: "EEE, MMM d,", time: "medium"});
	AppUtils.formatLongDate = function(timestamp){
		var d = new Date(timestamp * 1000);
		return longDateFormat.format(d);
	}

})();