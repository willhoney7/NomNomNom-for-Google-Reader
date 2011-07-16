AppPrefs = {
	preferences: {
		"tapGets": "unread", //"unread" or "all",
		"cardWidth": "322px"
	},
	"get": function(preference){
		return AppPrefs.preferences[preference];	
	},
}