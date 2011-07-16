enyo.kind({
	name: "FeedView", 
	className: "feedView",
	kind: enyo.VFlexBox, 
	flex: 1,
	events: {
		onViewIcons: ""
	},
	components: [
		{kind: enyo.Toolbar, components: [
			{kind: enyo.GrabButton, onflick: "grabButtonFlick", onclick: "doViewIcons"},
			{kind: enyo.Spacer},
			{kind: enyo.ToolButton, icon: "source/images/menu-icon-new.png"}
		]},
		{kind: enyo.SnapScroller, autoVertical: false, vertical: false, horizontal: true, autoHorizontal: true, className: "enyo-hflexbox", flex: 1, components: [
			//{kind: "FeedPage"}
		]},
	],
	create: function(){
		this.inherited(arguments);	
	},

	grabButtonFlick: function(inSender, inEvent){
		console.error(inEvent);	
		 if (Math.abs(inEvent.yVel) > Math.abs(inEvent.xVel)) {
	         if (inEvent.yVel > 0) {
	    		this.doViewIcons()
	         }
	      }
	},

	loadFeed: function(feed){
		//this.$.header.setContent(this.getFeed().label || this.getFeed().title);

		reader.getItems(feed.id, enyo.bind(this, this.loadedItems));
	},
	loadedItems: function(items){
		this.$.snapScroller.destroyControls();

		this.items = items;
		var components = []
		for(var i = 0; i < this.items.length; i++){
			components.push({kind: "FeedCard", feed: this.items[i]});	
		}
		this.$.snapScroller.createComponents(components, {owner: this});
		this.$.snapScroller.render();
		this.$.snapScroller.setIndex(0);
	}
});