enyo.kind({
	name: "GoogleReader",
	kind: enyo.VFlexBox,
	height: "100%",
	className: "googleReader",
	components: [
		{kind: "Pane", flex: 1, transitionKind: "enyo.transitions.Fade", components: [
		    {kind: "FeedList", onViewFeed: "viewFeed", onflick: "flick", onRefresh: "getSubscriptions"},
		    {kind: "FeedView", onViewIcons: "viewIcons"}
		]},		
	],
	create: function(){
		this.inherited(arguments);
	},

	flick: function(inSender, inEvent){
		console.error(inEvent);	
		 if (Math.abs(inEvent.yVel) > Math.abs(inEvent.xVel)) {
	         if (inEvent.yVel < 0) {
	         	this.viewFeed(this, reader.getFeeds()[0]);
	         } //else {
	          //  this.$.pane.back();
	        // }
	      }

	},
	viewIcons: function(inSender){
		this.$.pane.selectViewByIndex(0);	
	},
	viewFeed: function(inSender, inFeed){
	    this.$.pane.selectViewByIndex(1);
	    this.$.feedView.loadFeed(inFeed);	
	},

	loadFeed: function(inSender, inFeed){
		this.$.feedPreviewList.setFeed(inFeed);
	},
	loadItem: function(inSender, inEvent){
		this.$.itemView.setItem(inSender.items[inEvent.rowIndex]);
	}
});