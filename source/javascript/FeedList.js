enyo.kind({
	name: "FeedList", 
	className: "feedList",
	kind: enyo.VFlexBox, 
	events: {
		onViewFeed: ""
	},
	components: [
		{kind: enyo.SnapScroller, autoVertical: false, vertical: false, flex: 1, components: [
			//{kind: "FeedPage"}
		]},
		{kind: enyo.Toolbar, components: [
			{kind: enyo.Control, content: "Google Reader", className: "toolbarText"},
			{kind: enyo.Spacer},
			{kind: enyo.ToolButton, icon: "source/images/menu-icon-new.png", onclick: "addFeed"},
			{name: "refresh", kind: enyo.ToolButton, icon: "source/images/menu-icon-refresh.png", onclick: "loadFeeds"},
			{kind: enyo.ToolButton, icon: "source/images/menu-icon-settings.png"}
		]},
		{kind: "LoginPopup", name: "login", onLoginSuccess: "loginSuccess"},
		{kind: "AddFeedPopup", name: "addFeedPopup"},
		{kind: "FeedPopup"}
	],
	create: function(){
		this.inherited(arguments);	
		
		reader.load();

		if(reader.is_logged_in === true){
			this.loginSuccess();
		}

		AppUtils.refreshIcons = enyo.bind(this, this.loadFeeds);
	},
	rendered: function(){
		if(reader.is_logged_in === false){
	   	 	this.$.login.showAtCenter();
		}	
	},

	loginSuccess: function(){
		this.getToken();
	},

	getToken: function(){
		this.$.refresh.addClass("spinning");

		reader.getToken(enyo.bind(this, this.loadFeeds), enyo.bind(this, this.reportError));	
	},

	loadFeeds: function(inSender){
		this.$.refresh.addClass("spinning");

		reader.loadFeeds(enyo.bind(this, this.load));
	},

	reportError: function(error){
		this.$.refresh.removeClass("spinning");		
		console.error(error);
	},

	load: function(){
		this.$.refresh.removeClass("spinning");

		this.$.snapScroller.destroyControls();

		//eventually support pages
		this.$.snapScroller.createComponent({
			kind: "FeedPage", 
			feeds: reader.getFeeds(), 
			onViewFeed: "doViewFeed", 
			onViewFeedPopup: "viewFeedPopup",
			onRenameFeed: "renameFeed",
		}, {owner: this});
		this.$.snapScroller.render();
	},

	viewFeedPopup: function(inSender, inFeed, inEvent){
		this.$.feedPopup.showAtEvent(inEvent, inFeed);
	},

	addFeed: function(){
		this.$.addFeedPopup.showAtCenter();
	}
});