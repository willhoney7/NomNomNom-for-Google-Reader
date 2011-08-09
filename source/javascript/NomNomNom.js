enyo.kind({
	name: "NomNomNom",
	kind: enyo.VFlexBox,
	height: "100%",
	className: "googleReader",
	components: [
		{name: "feedIconList", kind: "NomNomNom.FeedIconList", onViewFeed: "viewFeed", onflick: "flick", onRefresh: "getSubscriptions"},
		{name: "toolbar", kind: "NomNomNom.Toolbar", onViewSmallIcons: "viewSmallIcons", onHideIcons: "hideIcons"},
		{name: "feedView", kind: "NomNomNom.FeedView", showing: true, onViewIcons: "viewIcons", onFeedLoaded: "feedLoaded"},
  
  		{kind: "ApplicationEvents", onWindowRotated: "resizeHandler"}

	],
	create: function(){
		this.inherited(arguments);

		//set the height to grid style
		AppUtils.iconListShowing = true;
		this.$.feedIconList.applyStyle("height", window.innerHeight - 55 + "px");

		AppUtils.viewIcons = enyo.bind(this, this.viewIcons);
	},

	resizeHandler: function(){
		if(AppUtils.iconListShowing && _(this.$.feedIconList.$.grid.getClassName()).includes("enyo-grid")){
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
		AppUtils.iconListShowing = true;

		this.$.feedIconList.$.grid.removeClass("enyo-hflexbox");
		this.$.feedIconList.$.grid.addClass("enyo-grid");
		this.$.feedIconList.applyStyle("height", window.innerHeight - 55 + "px");

		this.$.feedView.$.itemView.hide();
		
		setTimeout(enyo.bind(this, function(){
			this.$.feedView.hide();
			this.$.feedView.$.snapScroller.resized();
			//hide the feedView once it off the screen
		}), 800);	

		this.$.feedIconList.loadFeeds();
		this.$.toolbar.setTitle("NomNomNom for Google Reader"); //@TODO: there will be a bug here if anyone names a feed this
	},
	viewSmallIcons: function(inSender){
		AppUtils.iconListShowing = true;

		this.$.feedIconList.$.grid.removeClass("enyo-grid");
		this.$.feedIconList.$.grid.addClass("enyo-hflexbox");
		this.$.feedIconList.applyStyle("height", "120px");
		this.$.feedIconList.loadFeeds();
		
	},
	
	hideIcons: function(inSender){
		this.$.feedIconList.applyStyle("height", "0px");
		AppUtils.iconListShowing = false;
	},
	viewFeed: function(inSender, inFeed, inFeedIcon){

		this.inFeedIcon = inFeedIcon;
		this.inFeedIcon.startSpinning();
	    this.$.feedView.loadFeed(inFeed);	
	},
	feedLoaded: function(inSender, hasItems){
		this.inFeedIcon.stopSpinning();
		
		if(hasItems){
			this.$.feedView.setShowing(true);	
			this.$.feedView.applyStyle("min-height", window.innerHeight - 55 + "px");	

			this.hideIcons();
			setTimeout(enyo.bind(this, function(){
				this.$.feedView.applyStyle("min-height", null);	
			}), 500);
			
		    this.$.toolbar.setTitle(inSender.getFeed().title);	
		} else {

		}
		
	}
});

/* TODO
	-app menu
	-pay attention to "starred" status in item cards when marked in item view
	-sorting

	//First update
	-node.js service save to db8
		-pull all data from db8
	-notifications*/