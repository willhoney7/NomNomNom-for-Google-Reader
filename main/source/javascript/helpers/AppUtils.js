(function(){
	window.AppUtils = {};

	try {
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
	} catch(e){
		AppUtils.formatDate = function(timestamp){
			var d = new Date(timestamp * 1000);
			var date = d.getUTCDate(), hrs = d.getUTCHours(), mins = d.getUTCMinutes();

			return date + " " + hrs + ":" + mins;
		}
		AppUtils.formatLongDate = function(timestamp){
			var d = new Date(timestamp * 1000);
			var mo = d.getUTCMonth() + 1, date = d.getUTCDate(), hrs = d.getUTCHours(), mins = d.getUTCMinutes();

			return mo + "/" + date + " " + hrs + ":" + mins;
		}
	}

})();