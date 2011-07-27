enyo.kind({
	name: "GoogleReader",
	kind: enyo.VFlexBox,
	height: "100%",
	className: "googleReader",
	components: [
		{kind: "IconList", onViewFeed: "viewFeed", onflick: "flick", onRefresh: "getSubscriptions"},
		//{kind: enyo.Spacer},
		{kind: "gReader.Toolbar", onSelectIcon: "selectIcon", onSelectedIcon: "selectedIcon"},
		{kind: "FeedView", showing: false, onViewIcons: "viewIcons"}

	],
	create: function(){
		this.inherited(arguments);
		this.$.iconList.applyStyle("height", window.innerHeight - 50 + "px");
		AppUtils.iconListShowing = true;
		AppUtils.viewIcons = enyo.bind(this, this.viewIcons);
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
		this.$.iconList.applyStyle("height", window.innerHeight - 50 + "px");
		this.$.iconList.$.grid.setClassName("enyo-grid"); //set it to resize as a grid

		setTimeout(enyo.bind(this, function(){
			this.$.feedView.setShowing(false);
		}), 500);	
		this.$.iconList.loadFeeds();
		this.$.toolbar.setTitle("NomNomNom for Google Reader");
	},
	selectIcon: function(inSender){
		this.$.iconList.$.grid.setClassName("enyo-hflexbox"); //set it to just stack horizontally
		this.$.iconList.applyStyle("height", "110px");
		AppUtils.iconListShowing = true;
		this.$.iconList.loadFeeds();
	},
	selectedIcon: function(inSender){
		this.$.iconList.applyStyle("height", "0px");
		AppUtils.iconListShowing = false;
	},
	viewFeed: function(inSender, inFeed){

		this.$.iconList.applyStyle("height", "0px");
		AppUtils.iconListShowing = false;
		this.$.iconList.$.grid.setClassName("enyo-hflexbox"); //set it to just stack horizontally

		this.$.feedView.setShowing(true);
	    this.$.feedView.loadFeed(inFeed);	
	    this.$.toolbar.setTitle(inFeed.title || inFeed.label);
	}
});