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
					{content: $L("Order by"), kind: enyo.Control},
					{kind: enyo.Spacer},
					{kind: "ListSelector", value: "", preferenceProperty: "articleSort", onChange: "setPreference", items: [
						{caption: "Newest", value: "newest"},
						{caption: "Oldest", value: "oldest"}
					]}
				]},
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
				]},
				{kind: "Item", layoutKind: "HFlexLayout", components: [
					{content: $L("Automatically Mark as Read"), kind: enyo.Control},
					{kind: enyo.Spacer},
					{kind: "CheckBox", preferenceProperty: "autoMarkAsRead", onChange: "setPreference"}

				]},
				{kind: "Item", layoutKind: "HFlexLayout", components: [
					{content: $L("Form"), kind: enyo.Control},
					{kind: enyo.Spacer},
					{kind: "ListSelector", value: "", preferenceProperty: "articleView", rerenderView: true, onChange: "setPreference", items: [
						{caption: "Cards", value: "cards"},
						{caption: "List", value: "list"}
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
			{name: "instapaperLoginGroup", kind: enyo.RowGroup, caption: "Instapaper", components: [
				{name: "instapaperLogin", kind: enyo.Input, hint: "Username/email address", autoCapitalize: "lowercase", alwaysLooksFocused: false},
				{name: "instapaperPassword", kind: enyo.PasswordInput, hint: "Password", alwaysLooksFocused: false},
				{name: "instapaperLoginButton", kind: enyo.ActivityButton, content: "Log in", onclick: "instapaperLogin"},
			]},
			{name: "instapaperLoggedInGroup", kind: enyo.RowGroup, caption: "Instapaper", showing: false, components: [
				{kind: enyo.HFlexBox, components: [
					{flex: 1, name: "instapaperUsername"},
				]},
				{kind: enyo.Button, flex: 1, className: "enyo-button-negative", caption: "Log out", onclick: "instapaperLogout"}
			]},

			{name: "readitlaterLoginGroup", kind: enyo.RowGroup, caption: "Read it Later", components: [
				{name: "readitlaterLogin", kind: enyo.Input, hint: "Username", autoCapitalize: "lowercase", alwaysLooksFocused: false},
				{name: "readitlaterPassword", kind: enyo.PasswordInput, hint: "Password", alwaysLooksFocused: false},
				{name: "readitlaterLoginButton", kind: enyo.ActivityButton, content: "Log in", onclick: "readitlaterLogin"},
			]},
			{name: "readitlaterLoggedInGroup", kind: enyo.RowGroup, caption: "Read it Later", showing: false, components: [
				{kind: enyo.HFlexBox, components: [
					{flex: 1, name: "readitlaterUsername"},
				]},
				{kind: enyo.Button, flex: 1, className: "enyo-button-negative", caption: "Log out", onclick: "readitlaterLogout"}
			]},
			

			{kind: enyo.RowGroup, caption: "Google Account", components: [
				{kind: enyo.HFlexBox, components: [
					{flex: 1, name: "email"},

				]},
				{kind: enyo.Button, flex: 1, className: "enyo-button-negative", caption: "Log out", onclick: "logout"}

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

		if(reader.is_logged_in === false){
			this.close();
			humane("You need to log in first");
			return;
		}
		enyo.keyboard.setManualMode(false);

		this.$.email.setContent(reader.getUser().userEmail);
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

		if(AppPrefs.get("instapaperUsername") !== ""){
			this.$.instapaperLoginGroup.hide();
			this.$.instapaperLoggedInGroup.show();
			this.$.instapaperUsername.setContent(AppPrefs.get("instapaperUsername"));
		}

		if(AppPrefs.get("readitlaterUsername") !== ""){
			this.$.readitlaterLoginGroup.hide();
			this.$.readitlaterLoggedInGroup.show();
			this.$.readitlaterUsername.setContent(AppPrefs.get("readitlaterUsername"));
				
		}

	},

	setPreference: function(inSender, inValue){
		var value = (inSender.kind === "CheckBox") ? inSender.getChecked() : inValue;
		AppPrefs.set(inSender.preferenceProperty, value);

		if(inSender.rerenderManagement){
			publish("icons", ["refresh"]);
		} else if(inSender.rerenderView){
			publish("feedView", ["rerenderItems"]);
		} else if(inSender.restartRefresh){
			enyo.application.setupRefresh();
		}
	},

	logout: function(){
		publish("nomnomnom", ["logout"]);
		this.close();
	},

	instapaperLogin: function(){

		this.$.instapaperLoginButton.setActive(true);

		var username = this.$.instapaperLogin.getValue(), password = this.$.instapaperPassword.getValue();
		instapaper.authenticate(username, password, enyo.bind(this, function(response){
			this.$.instapaperLoginButton.setActive(false);
			
			if(response.status === 200){
				humane("Logged in!");
				this.$.instapaperLoginGroup.hide();
				this.$.instapaperLoggedInGroup.show();
				this.$.instapaperUsername.setContent(username);
				AppPrefs.set("instapaperUsername", username);
				AppPrefs.set("instapaperAuth", instapaper.makeAuth(username, password));

			} else if(response.status === 403){
				humane("Wrong username/password");
			} else if(response.status === 500){
				humane("Service encountered an error. Please try again later");
			}
		}));
	},
	instapaperLogout: function(){
		AppPrefs.set("instapaperAuth", "");	
		AppPrefs.set("instapaperUsername", "");
		this.$.instapaperLoggedInGroup.hide();
		this.$.instapaperLoginGroup.show();
					
	},

	readitlaterLogin: function(){

		this.$.readitlaterLoginButton.setActive(true);

		var username = this.$.readitlaterLogin.getValue(), password = this.$.readitlaterPassword.getValue();
		readitlater.authenticate(username, password, enyo.bind(this, function(response){

			this.$.readitlaterLoginButton.setActive(false);
			if(response.status === 200){
				humane("Logged in!");
				this.$.readitlaterLoginGroup.hide();
				this.$.readitlaterLoggedInGroup.show();
				this.$.readitlaterUsername.setContent(username);
				AppPrefs.set("readitlaterUsername", username);
				AppPrefs.set("readitlaterPassword", password);

			} else if(response.status === 400){
				humane("Invalid Request");
			} else if(response.status === 401){
				humane("Username and/or Password incorrect");
			} else if(response.status === 501){
				humane("API rate limit exceeded; Try again later");
			} else if(response.status === 503){
				humane("Read It Later's sync server is down for scheduled maintenance.");
			}
		}));
	},
	readitlaterLogout: function(){
		AppPrefs.set("readitlaterUsername", "");
		AppPrefs.set("readitlaterPassword", "");	
		this.$.readitlaterLoggedInGroup.hide();
		this.$.readitlaterLoginGroup.show();
					
	}


});
