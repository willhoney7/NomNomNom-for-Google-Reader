enyo.kind({
	name: "NomNomNom.Toolbar",
	kind: enyo.Toolbar,
	published: {
		title: ""
	},
	events: {
		 onViewSmallIcons: "", 
		 onHideIcons: ""
	},
	create: function(){
	 	this.inherited(arguments);

	 	AppUtils.setSpinner = enyo.bind(this, function(value){
	 		this.$.refresh.addRemoveClass("spinning", value);
	 	});
	 	
	},
	components: [		
		{kind: enyo.ToolButton, name: "home", icon: "source/images/menu-icon-home_.png", onclick: "viewIcons", showing: false},
		
		{kind: enyo.ToolButton, name: "feedTitle", caption: "Feeds", toggling: true, onclick: "titleSelect", showing: false},
		{kind: enyo.Control, name: "title", className: "toolbarText", content: "NomNomNom for Google Reader"},

		{kind: enyo.Spacer},
		{kind: enyo.ToolButton, name: "new", icon: "source/images/menu-icon-new.png", onclick: "addFeed"},
		{kind: enyo.ToolButton, name: "refresh", icon: "source/images/menu-icon-refresh.png", onclick: "loadFeeds"},
		{kind: enyo.ToolButton, name: "preferences", icon: "source/images/menu-icon-settings.png", onclick: "preferencesPopup"},

		{kind: "PreferencesPopup"},
		{kind: "AddFeedPopup"},
		{kind: "AboutPopup"},

		{kind: "AppMenu", components: [
		    {caption: "About/Help", onclick: "aboutPopup"},
		    {caption: "New Feed", onclick: "addFeed"},
		    {caption: "Refresh", onclick: "loadFeeds"},
		    {caption: "Preferences", onclick: "preferencesPopup"}
		]}

	],
	titleChanged: function(){
		if(this.title === "NomNomNom for Google Reader"){
			this.$.title.show();
			this.$.feedTitle.hide();
			this.$.home.hide();

		} else {
			this.$.title.hide();

			this.$.feedTitle.show();
			this.$.feedTitle.setCaption(this.title || "Untitled");
			this.$.feedTitle.setDepressed(false);
			
			this.$.home.show();	
		}
	},
	viewIcons: function(){
		AppUtils.viewIcons();	
	},
	titleSelect: function(inSender){
		if(inSender.depressed){
			this.doViewSmallIcons();
		} else {
			this.doHideIcons();
		}
	},

	addFeed: function(){
		this.$.addFeedPopup.showAtCenter();
	},
	preferencesPopup: function(){
		this.$.preferencesPopup.showAtCenter();	
	},
	aboutPopup: function(){
		this.$.aboutPopup.showAtCenter();
	},

	loadFeeds: function(){
		AppUtils.refreshIcons();
	}
});