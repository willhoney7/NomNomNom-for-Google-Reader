enyo.kind({
	name: "NomNomNom",
	kind: enyo.VFlexBox,
	height: "100%",
	className: "googleReader",
	components: [
		{name: "appComponents", kind: enyo.VFlexBox, flex: 1, components: [
			{name: "feedIconList", kind: "NomNomNom.FeedIconList", onViewFeed: "viewFeed", onflick: "flick", onRefresh: "getSubscriptions"},
			{name: "toolbar", kind: "NomNomNom.Toolbar", onViewSmallIcons: "viewSmallIcons", onHideIcons: "hideIcons"},
			{name: "feedView", kind: "NomNomNom.FeedView", showing: true, onViewIcons: "viewIcons", onFeedLoaded: "feedLoaded"},	
		]},
		{kind: "ApplicationEvents", onWindowRotated: "resizeHandler"},
  		{name: "login", className: "login", showing: false, flex: 1, kind: enyo.HFlexBox, components: [
  			{kind: enyo.Spacer},
  			{kind: enyo.VFlexBox, name: "step1", showing: false, width: "322px", components: [
  				{kind: enyo.Spacer},
				{kind: "ClassyButton", title: "Get Started", step: 1, color: "orange", style: "position: relative; top: 120px;", onclick: "goNextStep"},  				
  				{kind: enyo.Spacer},
  			]},
  			{kind: enyo.VFlexBox, name: "step2", showing: false, width: "322px", components: [
  				{kind: enyo.Spacer},
  				{kind: enyo.RowGroup, components: [
					{name: "emailAddress", kind: enyo.Input, hint: "Gmail Address", autoCapitalize: "lowercase", alwaysLooksFocused: true},
					{name: "password", kind: enyo.PasswordInput, hint: "Password", alwaysLooksFocused: true},
				]},
				{kind: "ClassyButton", title: "Log in", color: "orange", step: 2, onclick: "goNextStep"},
				{name: "errorResponse", className: "errorText"},
	  			{kind: enyo.Spacer},
	  			
	  		]},
	  		{kind: enyo.VFlexBox, name: "step3", showing: false, width: "200px", components: [
  				{kind: enyo.Spacer},
  				{kind: enyo.HFlexBox, style: "position: relative; top: 60px; right: 153px;", components: [
	  				{kind: enyo.Spacer},
					{kind: "ClassyButton", title: "Give me the tour!", color: "green", step: 3, onclick: "goNextStep"},
					{kind: "ClassyButton", title: "Give me my feeds!", color: "orange", onclick: "initializeGoogleReader"},
	  				{kind: enyo.Spacer},
				]},
	  			{kind: enyo.Spacer},
	  			
	  		]},
	  		{kind: enyo.Spacer}
	  	]}

	],
	create: function(){
		this.inherited(arguments);

		//set the height to grid style
		AppUtils.iconListShowing = true;
		this.$.feedIconList.applyStyle("height", window.innerHeight - 55 + "px");

		AppUtils.viewIcons = enyo.bind(this, this.viewIcons);
		AppUtils.logout = enyo.bind(this, this.logout);
		AppUtils.initializeGoogleReader = enyo.bind(this, this.initializeGoogleReader);

		reader.load(); //load the saved data
		this.initializeGoogleReader();	

	},

	initializeGoogleReader: function(){
		if(reader.is_logged_in === true){
			this.setupLogin(0);
			var deviceInfo = enyo.fetchDeviceInfo();
			if(deviceInfo === undefined || (deviceInfo && deviceInfo.wifiAvailable === true)){
				this.$.feedIconList.removeClass("noWifi");
				this.loadFeeds();
			} else {
				this.$.feedIconList.addClass("noWifi");
			}
		} else {
			this.setupLogin(1);
		}
	},
	setupLogin: function(inStep){
		if(inStep > 0){			
			this.$.appComponents.hide();
			this.$.login.show();
			this.$.login.setClassName("login enyo-hflexbox " + "step" + inStep);
			this.loginStep = inStep;

			if(this.loginStep === 1){
				this.$.step1.show();
				this.$.step2.hide();
				this.$.step3.hide();
			} else if(this.loginStep === 2){
				this.$.step1.hide();
				this.$.step2.show();
				this.$.step3.hide();
			} else if(this.loginStep === 3){
				this.$.step1.hide();
				this.$.step2.hide();
				this.$.step3.show();
			}
		} else if (!inStep){ //zero or undefined
			this.$.appComponents.show();
			this.$.login.hide();
		}
	},
	goNextStep: function(inSender){
		if(inSender.step === 1){
			this.setupLogin(2);
		} else if(inSender.step === 2){
			var emailAddress = this.$.emailAddress.getValue(),
				password = this.$.password.getValue();

			this.$.errorResponse.setContent("");
			//this.$.activityButton.setActive(true);  @TODO: use a spinner
			reader.login(emailAddress, password, enyo.bind(this, this.loginSuccess), enyo.bind(this, this.reportError));
		} else if(inSender.step === 3){
			alert("Coming soon!");
		}
	},

	reportError: function(error){
		//this.$.activityButton.setActive(false);
		this.$.errorResponse.setContent("Error: " + error);
	},

	loginSuccess: function(){
		this.setupLogin(3);	
	},

	loadFeeds: function(){
		this.getToken();
	},

	logout: function(){
		reader.logout();

		this.$.feedIconList.$.grid.destroyControls();
		this.$.feedIconList.$.grid.render();

		setTimeout(enyo.bind(this, function(){
			this.initializeGoogleReader();
			//this.$.login.showAtCenter();		
		}), 0);
		
	},

	getToken: function(){
		reader.getToken(AppUtils.refreshIcons, function(error){ console.error(error)});	
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
	//spinner on login
	//enter submits

	//First update
	-node.js service save to db8
		-pull all data from db8
	-notifications*/