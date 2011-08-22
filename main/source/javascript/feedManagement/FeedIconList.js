enyo.kind({
	name: "NomNomNom.FeedIconList", 
	className: "feedIconList",
	kind: enyo.VFlexBox, 
	events: {
		onViewFeed: ""
	},
	components: [
		{kind: enyo.Scroller, accelerated: false, autoVertical: true, vertical: true, onScrollStart: "scrollStart", className: "scrollerBackground", flex: 1, components: [
			{kind: enyo.VFlexBox, className: "container", flex: 1, components: [
				{name: "grid", className: "iconContainer enyo-grid", flex: 1}
			]}
		]},
		{kind: enyo.Control, className: "fade"},

		{kind: "FeedPopup"},
		{name: "FeedSelectionPopup", kind: enyo.PopupList, onSelect: "feedSelected"}
	],
	create: function(){
		this.inherited(arguments);	

		//no need to unsubscribe later, it will be gc'd on app close.
		subscribe("icons", _.bind(function(action){
			if(action === "refresh"){
		        this.loadFeeds();			
			} else if(action === "reloadUnreadCounts"){
				this.refreshUnreadCounts();
			}
	    }, this));

	},

	destroy: function(){
		this.inherited(arguments);	
	},

	loadFeeds: function(inSender){

		if(reader.is_initialized){
			publish("toolbar", ["setSpinner", true]);
			reader.loadFeeds(enyo.bind(this, this.load));	
		} else {
			if(reader.hasInternet){
				publish("nomnomnom", ["initializeGoogleReader"]);
			}
		}
		
	},

	reportError: function(error){
		publish("toolbar", ["setSpinner", false]);

		console.error(error);
	},

	load: function(){
		publish("toolbar", ["setSpinner", false]);

		this.$.grid.destroyControls();
		
		var components = [], feeds = reader.getFeeds(), hasFeeds = false;
		for(var i = 0; i < feeds.length; i++){
			if(!feeds[i].isSpecial)	{
				hasFeeds = true;
			}
			if((AppPrefs.get("hideRead") === true && feeds[i].count > 0 ) || (AppPrefs.get("hideRead") === false || feeds[i].isSpecial)){
				if((feeds[i].id === reader.TAGS["star"] && AppPrefs.get("showStarred")) || feeds[i].id !== reader.TAGS["star"]){
					if((feeds[i].id === reader.TAGS["share"] && AppPrefs.get("showShared")) || feeds[i].id !== reader.TAGS["share"]){
						components.push({kind: "FeedIcon", feed: feeds[i], onViewFeed: "viewFeed", onViewFeedPopup: "viewFeedPopup", onFolderOpen: "folderOpened"});
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

		//AppPrefs.set("notifyFeeds", {start: true});
		
		var feedsToNotifyFor = AppPrefs.get("notifyFeeds");
		if(feedsToNotifyFor.start){
			//console.log("Setting up feed notifications.");
			_(reader.getFeeds()).each(function(feed){
				if(!feed.isSpecial){
					feedsToNotifyFor[feed.id] = {count: feed.count, title: feed.title};				
				}
			});
			delete feedsToNotifyFor.start;
			AppPrefs.set("notifyFeeds", feedsToNotifyFor);
		}
	},

	refreshUnreadCounts: function(){
		if(this.owner.iconListShowing){	
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