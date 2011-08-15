enyo.kind({
	name: "PreferencesPopup",
	kind: enyo.Popup,
	scrim: true,
	modal: true,
	autoClose: true,
	dismissWithClick: true,
	width: "400px",
	events: {
	
	},
	components: [
		{layoutKind: "HFlexLayout", style: "position: relative", components: [
			{content: "Preferences"},
			{kind: "Spacer"},
			{kind: "ToolButton", icon: "source/images/menu-icon-close.png", style: "position: absolute; bottom: -10px; right: -10px", onclick: "close"}
		]},	
		{kind: enyo.Scroller, height: "450px", autoVertical: false, components: [
			{kind: enyo.RowGroup, caption: "Icons", components: [
				{kind: "Item", layoutKind: "HFlexLayout", components: [
					{content: $L("Hide Read"), kind: enyo.Control},
					{kind: enyo.Spacer},
					{kind: "CheckBox", preferenceProperty: "hideRead", rerenderManagement: true, onChange: "setPreference"}
				]},
				{kind: "Item", layoutKind: "HFlexLayout", components: [
					{content: $L("Show Starred Feed"), kind: enyo.Control},
					{kind: enyo.Spacer},
					{kind: "CheckBox", preferenceProperty: "showStarred", rerenderManagement: true, onChange: "setPreference"}
				]},
				{kind: "Item", layoutKind: "HFlexLayout", components: [
					{content: $L("Show Shared Feed"), kind: enyo.Control},
					{kind: enyo.Spacer},
					{kind: "CheckBox", preferenceProperty: "showShared", rerenderManagement: true, onChange: "setPreference"}
				]},
			]},
			{kind: enyo.RowGroup, caption: "Notifications", components: [
				{kind: "Item", layoutKind: "HFlexLayout", components: [
					{content: $L("Enable Notifications"), kind: enyo.Control},
					{kind: enyo.Spacer},
					{kind: "CheckBox", preferenceProperty: "notify", restartRefresh: true, onChange: "setPreference"}
				]},
				{kind: "Item", layoutKind: "HFlexLayout", components: [
					{content: $L("Notification Interval"), kind: enyo.Control},
					{kind: enyo.Spacer},
					{kind: "ListSelector", value: "", preferenceProperty: "notifyInterval", restartRefresh: true, onChange: "setPreference", items: [
						//{caption:"15 seconds", value: .25},
						{caption:"20 mins", value: 20},
						{caption:"1 hour", value: 60},
						{caption:"3 hours", value: 180},
						{caption:"8 hours", value: 480},
						{caption:"24 hours", value: 1440},
					]}				
				]},
			]},
			{kind: enyo.RowGroup, caption: "Article Previews", components: [
				{kind: "Item", layoutKind: "HFlexLayout", components: [
					{content: $L("Font-Size"), kind: enyo.Control},
					{kind: enyo.Spacer},
					{kind: "ListSelector", value: "", preferenceProperty: "itemCardFontSize", rerenderView: true, onChange: "setPreference", items: [
						"10px",
						"11px",
						"12px",
						"13px",
						"14px",
						"15px",
						"16px",
						"17px",
						"18px",
						"19px",
						"20px"
					]}
				]}
			]},
			{kind: enyo.RowGroup, caption: "Article Full View", components: [
				{kind: "Item", layoutKind: "HFlexLayout", components: [
					{content: $L("Font-Size"), kind: enyo.Control},
					{kind: enyo.Spacer},
					{kind: "ListSelector", value: "", preferenceProperty: "itemViewFontSize", rerenderView: true, onChange: "setPreference", items: [
						"10px",
						"11px",
						"12px",
						"13px",
						"14px",
						"15px",
						"16px",
						"17px",
						"18px",
						"19px",
						"20px"
					]}
				]}
			]},
			{kind: enyo.RowGroup, caption: "Account", components: [
				{kind: "Item", layoutKind: "VFlexLayout", components: [
					{kind: enyo.HFlexBox, components: [
						{flex: 1, name: "email"},

					]},
					{kind: enyo.Button, flex: 1, className: "enyo-button-negative", caption: "Log out", onclick: "logout"}
				]},
			]},

		]}		
	],
	close: function(){
		this.inherited(arguments);
	},
	showAtCenter: function(){
		if(this.lazy) {
			this.validateComponents();
		}
		this.$.email.setContent("Logged in as " + reader.getUser().userEmail);
		this.$.scroller.setScrollTop(0);
		this.openAtCenter();

		_.each(this.getComponents(), function(component){
			if(component.preferenceProperty){
				if(component.kind === "CheckBox"){
					component.setChecked(AppPrefs.get(component.preferenceProperty));
				} else {
					component.setValue(AppPrefs.get(component.preferenceProperty));
				}
			}
		});

	},

	setPreference: function(inSender, inValue){
		var value = (inSender.kind === "CheckBox") ? inSender.getChecked() : inValue;
		AppPrefs.set(inSender.preferenceProperty, value);

		if(inSender.rerenderManagement){
			AppUtils.refreshIcons();
		} else if(inSender.rerenderView){
			AppUtils.refreshItems();
		} else if(inSender.restartRefresh){
			enyo.application.setupRefresh();
		}
	},

	logout: function(){
		AppUtils.logout();
		this.close();
	}

});
