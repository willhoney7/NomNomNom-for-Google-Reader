enyo.kind({
	name: "NomNomNom.FeedIconList", 
	className: "feedIconList",
	kind: enyo.VFlexBox, 
	events: {
		onViewFeed: ""
	},
	components: [
		{kind: enyo.Scroller, autoVertical: false, vertical: false, onScrollStart: "scrollStart", flex: 1, components: [
			{name: "grid", className: "iconContainer enyo-grid", flex: 1}
		]},
		{kind: enyo.Control, className: "fade"},

		{kind: "FeedPopup"},
		{name: "FeedSelectionPopup", kind: enyo.PopupList, onSelect: "feedSelected"}
	],
	create: function(){
		this.inherited(arguments);	
	
		//Global Functions
		AppUtils.refreshIcons = enyo.bind(this, this.loadFeeds);
		AppUtils.refreshUnreadCounts = enyo.bind(this, this.refreshUnreadCounts);

	},

	loadFeeds: function(inSender){

		if(reader.is_initialized){
			enyo.call(AppUtils, "setSpinner", [true]);
			reader.loadFeeds(enyo.bind(this, this.load));	
		} else {
			var deviceInfo = enyo.fetchDeviceInfo();
			if(!deviceInfo || (deviceInfo && deviceInfo.wifiAvailable === true)){
				AppUtils.initializeGoogleReader();	
			}
		}
		
	},

	reportError: function(error){
		enyo.call(AppUtils, "setSpinner", [false]);

		console.error(error);
	},

	load: function(){
		enyo.call(AppUtils, "setSpinner", [false]);

		this.$.grid.destroyControls();
		
		var components = [], feeds = reader.getFeeds(), hasFeeds = false;
		for(var i = 0; i < feeds.length; i++){
			if((AppPrefs.get("hideRead") === true && feeds[i].count > 0 ) || (AppPrefs.get("hideRead") === false || feeds[i].isSpecial)){
				if((feeds[i].id === reader.TAGS["star"] && AppPrefs.get("showStarred")) || feeds[i].id !== reader.TAGS["star"]){
					if((feeds[i].id === reader.TAGS["share"] && AppPrefs.get("showShared")) || feeds[i].id !== reader.TAGS["share"]){
						components.push({kind: "FeedIcon", feed: feeds[i], onViewFeed: "viewFeed", onViewFeedPopup: "viewFeedPopup", onFolderOpen: "folderOpened"});
						if(!feeds[i].isSpecial)	{
							hasFeeds = true;
						}
					}
				}
			}		
		}

		if(hasFeeds > 0){
			this.$.grid.createComponents(components, {owner: this});
			this.$.grid.render();	
			this.removeClass("noFeeds");
		} else {
			this.addClass("noFeeds");
		}
		
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

	folderOpened: function(inSender, inFolderPopup){
		this.openedFolderPopup = inFolderPopup;
	},
	scrollStart: function(inSender, inIndex){
		if(this.openedFolderPopup && this.openedFolderPopup.isOpen){
			this.openedFolderPopup.close();
			this.openedFolderPopup = null;
		}
	}
	
});