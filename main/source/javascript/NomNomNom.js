enyo.kind({
	name: "NomNomNom",
	kind: enyo.VFlexBox,
	height: "100%",
	className: "googleReader",
	components: [
		{name: "appComponents", kind: enyo.VFlexBox, flex: 1, components: [
			{name: "feedIconList", kind: "NomNomNom.FeedIconList", onViewFeed: "viewFeed", onflick: "flick", onRefresh: "getSubscriptions"},
			{name: "toolbar", kind: "NomNomNom.Toolbar", onViewSmallIcons: "viewSmallIcons", onHideIcons: "hideIcons"},
			{name: "feedView", kind: "NomNomNom.FeedView", showing: true, onViewIcons: "viewIcons", onFeedLoaded: "feedLoaded", onDismiss: "reclaimSpace"},	
		]},
  		{name: "login", className: "login", showing: false, flex: 1, kind: enyo.HFlexBox, onclick: "loginClick", components: [
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
					{name: "password", kind: enyo.PasswordInput, hint: "Password", onkeydown: "passwordKeydown", alwaysLooksFocused: true},
				]},
				{kind: "ClassyButton", name: "loginButton", title: "Log in", color: "orange", step: 2, onclick: "goNextStep"},
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
	  		{kind: enyo.VFlexBox, name: "step9", showing: false, width: "200px", components: [
  				{kind: enyo.Spacer},
  				{kind: enyo.HFlexBox, style: "position: relative; top: 310px; right: 153px;", components: [
	  				{kind: enyo.Spacer},
					{kind: "ClassyButton", title: "Twitter", color: "green", onclick: "twitter"},
					{kind: "ClassyButton", title: "Email", color: "green", onclick: "email"},
	  				{kind: enyo.Spacer},
				]},
				{kind: "ClassyButton", title: "", color: "orange", large: true, style: "position: relative; top: 107px; left: 350px;", onclick: "initializeGoogleReader"},
	  			{kind: enyo.Spacer},
	  		]},
	  		{kind: enyo.Spacer}
	  	]},

	  	{kind: "ApplicationEvents", onWindowRotated: "resizeHandler", onWindowActivated: "activate"},
	  	{ name: "connection", kind: "PalmService", service: "palm://com.palm.connectionmanager/", method: "getstatus",onResponse: "connectionResponseHandler", subscribe: true, resubscribe: true}
	],
	create: function(){
		this.inherited(arguments);

		enyo.keyboard.setResizesWindow(false);

		reader.hasInternet = true;	//hasInternet until proven disconnected.

		//set the height to grid style
		AppUtils.iconListShowing = true;
		this.$.feedIconList.applyStyle("height", window.innerHeight - 55 + "px");

		AppUtils.viewIcons = enyo.bind(this, this.viewIcons);
		AppUtils.logout = enyo.bind(this, this.logout);
		AppUtils.initializeGoogleReader = enyo.bind(this, this.initializeGoogleReader);

		AppUtils.startTour = enyo.bind(this, function(){
			this.goNextStep({step: 3});
		});

		reader.load(); //load the saved data
		this.initializeGoogleReader();

		//enyo.application.viewFeed = enyo.bind(this,); @TODO
		
	},
	activate: function(){
		enyo.application.clearDashboard();
		AppUtils.refreshIcons();
	},

	initializeGoogleReader: function(){
		enyo.setAllowedOrientation("free");

		if(reader.is_logged_in === true){
			this.setupLogin(0);
			if(reader.hasInternet){
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
			enyo.keyboard.forceHide();	
			this.$.appComponents.hide();
			this.$.login.show();
			this.$.login.setClassName("login enyo-hflexbox " + "step" + inStep);
			this.loginStep = inStep;

			if(this.loginStep === 1){
				enyo.setAllowedOrientation("free");
				enyo.keyboard.setResizesWindow(false);

				this.$.step1.show();
				this.$.step2.hide();
				this.$.step3.hide();
				this.$.step9.hide();
			} else if(this.loginStep === 2){
				enyo.keyboard.setResizesWindow(true);
				enyo.keyboard.forceShow(4);
				this.$.emailAddress.forceFocus();
				this.$.step1.hide();
				this.$.step2.show();
				this.$.step3.hide();
				this.$.step9.hide();
			} else if(this.loginStep === 3){
				enyo.keyboard.setResizesWindow(false);
				this.$.step1.hide();
				this.$.step2.hide();
				this.$.step3.show();
				this.$.step9.hide();
			} else if(this.loginStep > 3 && this.loginStep < 9){
				enyo.setAllowedOrientation("landscape");
				this.$.step1.hide();
				this.$.step2.hide();
				this.$.step3.hide();
				this.$.step9.hide();
			} else if(this.loginStep === 9){
				enyo.setAllowedOrientation("landscape");
				this.$.step9.show();
			}
		} else if (!inStep){ //zero or undefined
			enyo.setAllowedOrientation("free");
			enyo.keyboard.setResizesWindow(false);

			this.$.appComponents.show();
			this.$.login.hide();
		}
	},
	passwordKeydown: function(inSender, inEvent) {
		if (inEvent.keyCode === 13) {
			this.goNextStep({step: 2});
			inEvent.preventDefault();

		}
	},
	goNextStep: function(inSender, inEvent){
		if(inSender.step === 1){
			this.setupLogin(2);
		} else if(inSender.step === 2){
			var emailAddress = this.$.emailAddress.getValue(),
				password = this.$.password.getValue();

			this.$.errorResponse.setContent("");
			this.$.loginButton.setActive(true); 
			reader.login(emailAddress, password, enyo.bind(this, this.loginSuccess), enyo.bind(this, this.reportError));
		} else if(inSender.step === 3){
			//tour
			this.setupLogin(4);
		} else if(inSender.step > 3 && inSender.step < 9){
			this.setupLogin(inSender.step + 1);
		}

		if(inEvent){
			inEvent.stopPropagation();
		}
	},
	loginClick: function(){
		//for clicking when we are on the tour.
		if(this.loginStep > 3 && this.loginStep < 9){
			this.goNextStep({step: this.loginStep});
		}
	},

	reportError: function(error){
		this.$.loginButton.setActive(false);
		this.$.errorResponse.setContent("Error: " + error);
	},

	loginSuccess: function(){
		this.$.loginButton.setActive(false);
		this.setupLogin(3);	
	},

	loadFeeds: function(){
		this.getToken();
	},

	logout: function(){
		reader.logout();

		AppPrefs.set("notifyFeeds", {start: true});

		this.$.feedIconList.$.grid.destroyControls();
		this.$.feedIconList.$.grid.render();

		setTimeout(enyo.bind(this, function(){
			this.initializeGoogleReader();
			//this.$.login.showAtCenter();		
		}), 0);
		
	},

	twitter: function(){
		window.location = "http://twitter.com/Tibfib";	
	},
	email: function(){
		window.location = "mailto:nomnomnomRSS@gmail.com";	
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
		this.$.feedIconList.$.scroller.setVertical(true);
		this.$.feedIconList.$.scroller.setAutoVertical(true);
		this.$.feedView.$.itemView.hide();
		
		setTimeout(enyo.bind(this, function(){
			this.$.feedView.hide();
			this.$.feedView.$.cardContainer.resized();
			//hide the feedView once it off the screen
		}), 1000);	

		this.$.feedIconList.loadFeeds();
		this.$.toolbar.setTitle("NomNomNom for Google Reader"); //@TODO: there will be a bug here if anyone names a feed this
	},
	viewSmallIcons: function(inSender){
		AppUtils.iconListShowing = true;

		this.$.feedIconList.$.grid.removeClass("enyo-grid");
		this.$.feedIconList.$.grid.addClass("enyo-hflexbox");
		this.$.feedIconList.applyStyle("height", "120px");
		this.$.feedIconList.$.scroller.setVertical(false);
		this.$.feedIconList.$.scroller.setAutoVertical(false);
		this.$.feedIconList.loadFeeds();
		
	},
	
	hideIcons: function(inSender){
		this.$.feedIconList.applyStyle("height", "0px");
		AppUtils.iconListShowing = false;
	},
	viewFeed: function(inSender, inFeed, inFeedIcon){
		if(inFeedIcon){
			this.inFeedIcon = inFeedIcon;
			this.inFeedIcon.startSpinning();	
		}
		
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
	},
	reclaimSpace: function(){
		this.$.feedView.$.cardContainer.snapTo(this.$.feedView.$.cardContainer.getIndex());
	
	},
	connectionResponseHandler: function(inSender, inResponse){
		 if (inResponse.isInternetConnectionAvailable === true || !window.PalmSystem) {
		 	reader.hasInternet = true;
		 } else {
		 	reader.hasInternet = false;
		 }
	}
});