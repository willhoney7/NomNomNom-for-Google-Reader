enyo.kind({
	name: "GoogleReader",
	kind: enyo.VFlexBox,
	height: "100%",
	className: "googleReader",
	components: [
		{kind: "IconList", onViewFeed: "viewFeed", flex: 1, onflick: "flick", onRefresh: "getSubscriptions"},
		//{kind: enyo.Spacer},
		{kind: "gReader.Toolbar"},
		{kind: "FeedView", showing: false, onViewIcons: "viewIcons"}

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

		//this is a poor way to do this, but oh well
		this.$.iconList.applyStyle("max-height", null);
		this.$.iconList.$.grid.setClassName("enyo-grid"); //set it to resize as a grid

		this.$.feedView.setShowing(false);
		this.$.iconList.loadFeeds();
	},
	viewFeed: function(inSender, inFeed){

		this.$.iconList.applyStyle("max-height", "110px");
		this.$.iconList.$.grid.setClassName("enyo-hflexbox"); //set it to just stack horizontally

		this.$.feedView.setShowing(true);
	    this.$.feedView.loadFeed(inFeed);	
	    this.$.toolbar.setTitle(inFeed.title || inFeed.label);
	}
});