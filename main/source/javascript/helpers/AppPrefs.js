(function(){
	window.AppPrefs = {};

	if(!localStorage["preferences"]){
		localStorage["preferences"] = "{}";
	}

	var preferences; 

	AppPrefs.load = function(){
		preferences = enyo.mixin({
			"tapGets": "unread", //"unread" or "all",
			"itemCardFontSize": "14px",
			"itemViewFontSize": "14px",
			"viewActiveCardInItemView": true,
			"cardWidth": "322px",
			"autoMarkAsRead": true, 
			"articleView": "cards", // or "list"
			"hideRead": false,	//whether to show icons that have no unread icons
			"showStarred": true,
			"showShared": true,
			"browserPreview": false, //show items in webview
			"notify": true,
			"notifyFeeds": {start: true},
			"notifyInterval": 60,
			"instapaperUsername": "",
			"instapaperAuth": "",
			"readitlaterUsername": "",
			"readitlaterPassword": ""
		}, JSON.parse(localStorage["preferences"]));
	};

	AppPrefs.get = function(preference){
		AppPrefs.load();
		return preferences[preference];	
	};

	AppPrefs.set = function(preference, value){
		preferences[preference] = value;
		localStorage["preferences"] = JSON.stringify(preferences);
	};


})();