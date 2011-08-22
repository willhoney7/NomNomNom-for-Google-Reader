enyo.kind({
	name: "FeedFolderPopup",
	kind: enyo.Popup,
	className: "feedScroller feedIcon",
	width: "120px",
	published: {
		feeds: []	
	},
	events: {
		onViewFeed: "", 
		onViewFeedPopup: ""
	},
	components: [
		{name: "scroller", flex: 1, kind: enyo.BasicScroller, autoHorizontal: false, horizontal: false, autoVertical: true, components: []}
	],
	close: function(){
		this.owner.folderOpen = false
		this.inherited(arguments);	
	},
	create: function(){
		this.inherited(arguments);
	},
	showAtControl: function(inControl){
		if(this.lazy){
			this.validateComponents()
		}	
		this.$.scroller.destroyControls();
		
		var components = [];
		_.each(this.feeds, function(feed){
			if((AppPrefs.get("hideRead") === true && feed.count > 0) ||  AppPrefs.get("hideRead") === false){	
				components.push(
					{kind: "FeedIcon", feed: feed, inside: true, onViewFeed: "viewFeed", onViewFeedPopup: "viewFeedPopup"}
				);
			}
		}, this);
		this.$.scroller.createComponents(components, {owner: this});
		this.render();

		this.openAtControl(inControl, {top: -15 + this.owner.owner.$.scroller.scrollTop, left: -26});
	},
	viewFeed: function(inSender, inEvent){
		this.doViewFeed(inSender.feed);
		this.close();
	},
	viewFeedPopup: function(inSender, inFeed, inEvent){
		this.doViewFeedPopup(inEvent, inFeed);
	}
})