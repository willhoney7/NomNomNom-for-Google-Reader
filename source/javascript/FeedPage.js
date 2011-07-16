enyo.kind({
	name: "FeedPage", 
	className: "feedPage",
	kind: enyo.Grid, 
	height: "100%",
	width: "100%",
	published: {
		feeds: []
	},
	events: {
		onViewFeed: ""
	},
	components: [
		
	],
	create: function(){
		this.inherited(arguments);	
		this.feedsChanged();
	},
	feedsChanged: function(){
		var components = [];
		for(var i = 0; i < this.feeds.length; i++){
			components.push({kind: "FeedIcon", feed: this.feeds[i], onclick: "feedView"});
		}
		this.createComponents(components, {owner: this});
		this.render();
	},
	feedView: function(inSender, inEvent){
		this.doViewFeed(inSender.getFeed());
	}

});