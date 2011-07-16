(function(){
	window.AppUtils = {};

	var dateFormat = new enyo.g11n.DateFmt({date: "short", dateComponents: "dm"});
	AppUtils.formatDate = function(timestamp){
		var d = new Date(timestamp * 1000);
		return dateFormat.format(d);
	}

})();