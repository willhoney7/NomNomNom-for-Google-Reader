enyo.kind({
	name: "NomNomNom",
	kind: enyo.VFlexBox,
	height: "100%",
	className: "googleReader",
	components: [
		{name: "feedIconList", kind: "NomNomNom.FeedIconList", onViewFeed: "viewFeed", onflick: "flick", onRefresh: "getSubscriptions"},
		{name: "toolbar", kind: "NomNomNom.Toolbar", onViewSmallIcons: "viewSmallIcons", onHideIcons: "hideIcons"},
		{name: "feedView", kind: "NomNomNom.FeedView", showing: false, onViewIcons: "viewIcons", onFeedLoaded: "feedLoaded"}

	],
	create: function(){
		this.inherited(arguments);

		//set the height to grid style
		this.$.feedIconList.applyStyle("height", window.innerHeight - 55 + "px");

		AppUtils.iconListShowing = true;
		AppUtils.viewIcons = enyo.bind(this, this.viewIcons);
	},

	resizeHandler: function(){
		if(AppUtils.iconListShowing){
			//@TODO: this'll animate resize. Looks funny
			this.$.feedIconList.applyStyle("height", window.innerHeight - 55 + "px");		
		}
	},

	flick: function(inSender, inEvent){
		 if (Math.abs(inEvent.yVel) > Math.abs(inEvent.xVel)) {
	         if (inEvent.yVel < 0) {
	         	//view the "all" feed
	         	this.viewFeed(this, reader.getFeeds()[0]);
	         }
	      }

	},
	viewIcons: function(inSender){
		this.$.feedIconList.$.grid.setClassName("enyo-grid"); //set it to resize as a grid
		this.$.feedIconList.applyStyle("height", window.innerHeight - 55 + "px");

		setTimeout(enyo.bind(this, function(){
			this.$.feedView.setShowing(false);
			//hide the feedView once it off the screen
		}), 500);	

		this.$.feedIconList.loadFeeds();
		this.$.toolbar.setTitle("NomNomNom for Google Reader"); //@TODO: there will be a bug here if anyone names a feed this
	},
	viewSmallIcons: function(inSender){
		this.$.feedIconList.$.grid.setClassName("enyo-hflexbox"); //set it to just stack horizontally
		this.$.feedIconList.applyStyle("height", "120px");
		this.$.feedIconList.loadFeeds();
		
		AppUtils.iconListShowing = true;
	},
	hideIcons: function(inSender){
		this.$.feedIconList.applyStyle("height", "0px");
		AppUtils.iconListShowing = false;
	},
	viewFeed: function(inSender, inFeed){
	    this.$.feedView.setFeed(inFeed);	
	},
	feedLoaded: function(inSender){
		this.hideIcons();
		this.$.feedView.setShowing(true);		
	    this.$.toolbar.setTitle(inSender.getFeed().title );
	}
});