enyo.kind({
	name: "NomNomNom.FeedIconList", 
	className: "feedIconList",
	kind: enyo.VFlexBox, 
	events: {
		onViewFeed: ""
	},
	components: [
		{kind: enyo.Scroller, className: "iconContainer", autoVertical: false, vertical: false, flex: 1, components: [
			{name: "grid", className: "enyo-grid", flex: 1}
		]},

		{kind: "LoginPopup", name: "login", onLoginSuccess: "loginSuccess"},
		{kind: "FeedPopup"},
		{name: "FeedSelectionPopup", kind: enyo.PopupList, onSelect: "feedSelected"}
	],
	create: function(){
		this.inherited(arguments);	
		
		reader.load(); //load the saved data

		if(reader.is_logged_in === true){
			this.loginSuccess();
		}

		//Global Functions
		AppUtils.refreshIcons = enyo.bind(this, this.loadFeeds);
		AppUtils.refreshUnreadCounts = enyo.bind(this, this.refreshUnreadCounts);
		AppUtils.logout = enyo.bind(this, this.logout);

	},
	rendered: function(){
		if(reader.is_logged_in === false){
	   	 	this.$.login.showAtCenter();
		}	
	},

	loginSuccess: function(){
		this.getToken();
	},

	logout: function(){

		localStorage["Auth"] = undefined;
		localStorage["User"] = undefined;
			
		this.$.grid.destroyControls();
		this.$.grid.render();
		this.$.login.showAtCenter();
		
	},

	getToken: function(){
		enyo.call(AppUtils, "setSpinner", [true]);

		reader.getToken(enyo.bind(this, this.loadFeeds), enyo.bind(this, this.reportError));	
	},

	loadFeeds: function(inSender){
		enyo.call(AppUtils, "setSpinner", [true]);

		reader.loadFeeds(enyo.bind(this, this.load));
	},

	reportError: function(error){
		enyo.call(AppUtils, "setSpinner", [false]);

		console.error(error);
	},

	load: function(){
		enyo.call(AppUtils, "setSpinner", [false]);

		this.$.grid.destroyControls();
		
		var components = [], feeds = reader.getFeeds();
		for(var i = 0; i < feeds.length; i++){
			if((AppPrefs.get("hideRead") === true && feeds[i].count > 0 ) || (AppPrefs.get("hideRead") === false || feeds[i].isSpecial)){
				if((feeds[i].id === reader.TAGS["star"] && AppPrefs.get("showStarred")) || feeds[i].id !== reader.TAGS["star"]){
					if((feeds[i].id === reader.TAGS["share"] && AppPrefs.get("showShared")) || feeds[i].id !== reader.TAGS["share"]){
						components.push({kind: "FeedIcon", feed: feeds[i], onViewFeed: "viewFeed", onViewFeedPopup: "viewFeedPopup"});			
					}
				}
			}		
		}
		this.$.grid.createComponents(components, {owner: this});
		this.$.grid.render();
	},

	refreshUnreadCounts: function(){
		if(AppUtils.iconListShowing){	
			_.each(this.$.grid.getControls(), function(feed){
				feed.updateUnreadCount();
			});
		}
			
	},
	viewFeed: function(inSender, inFeed){
		this.doViewFeed(inFeed, inSender);		
	},
	viewFeedPopup: function(inSender, inFeed, inEvent){
		this.$.feedPopup.showAtEvent(inEvent, inFeed);
	},
	showFeedSelection: function(inFeed, event){
		if(this.$.FeedSelectionPopup.lazy) {
			this.$.FeedSelectionPopup.validateComponents();
		}
		inFeed.caption = $L("All");
		this.popupFeeds = [inFeed];
		_.each(inFeed.feeds, enyo.bind(this, function(feed){
			feed.caption = feed.title;
			this.popupFeeds.push(feed);
		}));
		this.$.FeedSelectionPopup.setItems(this.popupFeeds);
		this.$.FeedSelectionPopup.openAtEvent(event);
	},
	feedSelected: function(inSender, inIndex){
		this.doViewFeed(this.popupFeeds[inIndex]);
	},
	
});