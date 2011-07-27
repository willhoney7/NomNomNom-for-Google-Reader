(function(){
	window.AppPrefs = {};

	if(!localStorage["preferences"]){
		localStorage["preferences"] = "{}";
	}

	var preferences = enyo.mixin({
		"tapGets": "unread", //"unread" or "all",
		"cardWidth": "322px",
		"hideRead": false,	//whether to show icons that have no unread icons
		"browserPreview": false //show items in webview
	}, JSON.parse(localStorage["preferences"]));


	AppPrefs.get = function(preference){
		return preferences[preference];	
	};

	AppPrefs.set = function(preference, value){
		preferences[preference] = value;
		localStorage["preferences"] = JSON.stringify(preferences);
	};


})();