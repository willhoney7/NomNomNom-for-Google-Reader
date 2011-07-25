AppPrefs = {
	preferences: {
		"tapGets": "unread", //"unread" or "all",
		"cardWidth": "322px"
	},
	get: function(preference){
		return AppPrefs.preferences[preference];	
	},
	set: function(preference, value){
		AppPrefs.perferences[preference] = value;
	}
}