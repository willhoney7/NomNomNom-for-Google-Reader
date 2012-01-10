enyo.kind({
	name: "NomNomNom",
	kind: enyo.Pane,
	height: "100%",
	className: "googleReader",
	components: [
		{name: "appComponents", style: "-webkit-transform: translate3d(0, 0, 0)", kind: enyo.VFlexBox, flex: 1, components: [
			{name: "feedIconList", 	style: "-webkit-transform: translate3d(0, 0, 0)", kind: "NomNomNom.FeedIconList", onViewFeed: "viewFeed", onflick: "flick", onRefresh: "getSubscriptions"},
			{name: "second", style: "-webkit-transform: translate3d(0, 0, 0)", kind: enyo.VFlexBox, components: [
				{name: "toolbar",  kind: "NomNomNom.Toolbar", onViewSmallIcons: "viewSmallIcons", onHideIcons: "hideIcons"},
				{name: "feedView", style: "-webkit-transform: translate3d(0, 0, 0)", kind: "NomNomNom.FeedView", showing: true, onViewIcons: "viewIcons", onFeedLoaded: "feedLoaded", onDismiss: "reclaimSpace"},	
			]}
		]},
  		{name: "login", flex: 1, kind: enyo.VFlexBox, onclick: "loginClick", components: [
  			{name: "loginPane", className: "login", layoutKind: "HFlexLayout", flex: 1, kind: enyo.Pane, transitionKind: "enyo.transitions.Fade", components: [
  				{kind: enyo.VFlexBox, flex: 1, name: "step1", className: "step step1", components: [
	  				{kind: enyo.Spacer},
					{kind: "ClassyButton", title: "Get Started", step: 1, color: "orange", style: "margin: auto; position: relative; top: 120px;", onclick: "goNextStep"},  				
	  				{kind: enyo.Spacer},
	  			]},
	  			{kind: enyo.VFlexBox, flex: 1, name: "step2", className: "step step2", components: [
			  		{kind: enyo.Spacer},
	  				{kind: enyo.HFlexBox, components: [
	  					{kind: enyo.Spacer},
	  					{kind: enyo.RowGroup, width: "322px", components: [
							{name: "emailAddress", kind: enyo.Input, hint: "Gmail Address", autoCapitalize: "lowercase", alwaysLooksFocused: true, onfocus: "showKeyboard"},
							{name: "password", kind: enyo.PasswordInput, hint: "Password", onkeydown: "passwordKeydown", alwaysLooksFocused: true, onfocus: "showKeyboard"},
						]},
			  			{kind: enyo.Spacer}
		  			]},
	  				{kind: "ClassyButton", name: "loginButton", title: "Log in", style: "margin: auto", color: "orange", step: 2, onclick: "goNextStep"},
					{name: "errorResponse", className: "errorText"},
					{kind: enyo.Spacer}
		  		]},
		  		{kind: enyo.VFlexBox, flex: 1, name: "step3", className: "step step3", components: [
	  				{kind: enyo.Spacer},
	  				{kind: enyo.HFlexBox, style: "position: relative; top: 60px; right: 5px;", components: [
		  				{kind: enyo.Spacer},
						{kind: "ClassyButton", title: "Give me the tour!", color: "green", step: 3, onclick: "goNextStep"},
						{kind: "ClassyButton", title: "Give me my feeds!", color: "orange", onclick: "initializeGoogleReader"},
		  				{kind: enyo.Spacer},
					]},
		  			{kind: enyo.Spacer},
		  		]},
		  		{kind: enyo.VFlexBox, flex: 1, name: "step4", className: "step step4"},
		  		{kind: enyo.VFlexBox, flex: 1, name: "step9", className: "step step9", width: "200px", components: [
	  				{kind: enyo.Spacer},
	  				{kind: enyo.HFlexBox, style: "position: relative; top: 310px; right: 5px;", components: [
		  				{kind: enyo.Spacer},
						{kind: "ClassyButton", title: "Twitter", color: "green", onclick: "twitter"},
						{kind: "ClassyButton", title: "Email", color: "green", onclick: "email"},
		  				{kind: enyo.Spacer},
					]},
					{kind: "ClassyButton", title: "", color: "orange", large: true, style: "margin: auto; position: relative; top: 107px; left: 350px;", onclick: "initializeGoogleReader"},
		  			{kind: enyo.Spacer},
		  		]},	
		  		{kind: enyo.VFlexBox, flex: 1, name: "reauthorize", className: "step reauthorize", components: [
		  			{kind: enyo.Spacer},
	  				{kind: enyo.HFlexBox, components: [
	  					{kind: enyo.Spacer},
	  					{kind: enyo.RowGroup, width: "322px", components: [
							{name: "reloginemailAddress", kind: enyo.Input, hint: "Gmail Address", autoCapitalize: "lowercase", alwaysLooksFocused: true, onfocus: "showKeyboard"},
							{name: "reloginpassword", kind: enyo.PasswordInput, hint: "Password", onkeydown: "reloginPasswordKeydown", alwaysLooksFocused: true, onfocus: "showKeyboard"},
						]},
			  			{kind: enyo.Spacer}
		  			]},
	  				{kind: "ClassyButton", name: "reloginButton", title: "Reauthorize", style: "margin: auto", color: "orange", onclick: "relogin"},
					{name: "reloginErrorResponse", className: "errorText"},
					{kind: enyo.Spacer}
		  		]}
	  		]}
	  	]},

	  	{kind: "ApplicationEvents", onWindowRotated: "resizeHandler", onWindowActivated: "activate"},
	  	{ name: "connection", kind: "PalmService", service: "palm://com.palm.connectionmanager/", method: "getstatus",onResponse: "connectionResponseHandler", subscribe: true, resubscribe: true}
	],
	create: function(){
		this.inherited(arguments);

		enyo.keyboard.setResizesWindow(false);

		reader.hasInternet = true;	//hasInternet until proven disconnected.

		//set the height to grid style
		this.iconListShowing = true; //piggy-back on the global reader object
		this.$.feedIconList.applyStyle("height", window.innerHeight - 55 + "px");
		this.$.feedView.applyStyle("height", window.innerHeight - 55 + "px");

		subscribe("nomnomnom", _(function(action){
			switch(action){
				case "viewIcons":
					this.viewIcons();
					break;
				case "logout":
					this.logout();
					break;
				case "initializeGoogleReader":
					this.initializeGoogleReader();
					break;
				case "startTour":
					this.goNextStep({step: 3});
					break;
			}
		}).bind(this));
		
		reader.load(); //load the saved data
		this.initializeGoogleReader();

		//enyo.application.viewFeed = enyo.bind(this,); @TODO
		
	},
	activate: function(){
		if(window.PalmSystem){
			enyo.application.clearDashboard();		
		}
		publish("icons", ["refresh"]);
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
			this.selectView(this.$.login);

			this.loginStep = inStep;
			this.$.loginPane.selectViewByName("step" + this.loginStep);

			if(this.loginStep === 1){
				enyo.setAllowedOrientation("free");
				enyo.keyboard.setResizesWindow(false);

			} else if(this.loginStep === 2){
				enyo.keyboard.setResizesWindow(true);
				//enyo.keyboard.forceShow(4);
				//this.$.emailAddress.forceFocus();

			} else if(this.loginStep === 3){
				enyo.keyboard.setResizesWindow(false);
			} else if(this.loginStep > 3 && this.loginStep < 9){
				this.$.step4.setClassName("step step" + this.loginStep);
				enyo.setAllowedOrientation("landscape");
			} else if(this.loginStep === 9){
				enyo.setAllowedOrientation("landscape");
			}
		} else if (!inStep){ //zero or undefined
			enyo.setAllowedOrientation("free");
			enyo.keyboard.setManualMode(false);
			enyo.keyboard.setResizesWindow(false);

			this.selectView(this.$.appComponents);
		}
	},
	passwordKeydown: function(inSender, inEvent) {
		if (inEvent.keyCode === 13) {
			this.goNextStep({step: 2});
			inEvent.preventDefault();
		}
	},
	showKeyboard: function(){
		enyo.keyboard.forceShow(4);	
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

	relogin: function(){
		var emailAddress = this.$.reloginemailAddress.getValue(),
			password = this.$.reloginpassword.getValue();

			this.$.reloginErrorResponse.setContent("");
			this.$.reloginButton.setActive(true); 
			
			reader.login(emailAddress, password, enyo.bind(this, function(){
				this.$.reloginButton.setActive(false);
				this.initializeGoogleReader();				

			}), enyo.bind(this, function(error){
				this.$.reloginButton.setActive(false);
				this.$.reloginErrorResponse.setContent("Error: " + error);

			}));

	},
	reloginPasswordKeydown: function(inSender, inEvent) {
		if (inEvent.keyCode === 13) {
			this.goNextStep({step: 2});
			inEvent.preventDefault();
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
		var thus = this;
		reader.getToken(function(){
			publish("icons", ["refresh"]);
		}, function(error){ console.error(error)
			reader.getToken(function(){
				publish("icons", ["refresh"]);
			}, function(error){
					enyo.keyboard.forceHide();	
					thus.selectView(thus.$.login);

					thus.$.loginPane.selectViewByName("reauthorize");
					enyo.keyboard.setResizesWindow(true);

			});
		});	

		/*enyo.keyboard.forceHide();	
		thus.selectView(thus.$.login);

		thus.$.loginPane.selectViewByName("reauthorize");*/
	},

	resizeHandler: function(){
		if(this.iconListShowing){
			if(_(this.$.feedIconList.$.grid.getClassName()).includes("enyo-grid")){
				this.$.feedIconList.applyStyle("height", window.innerHeight - 55 + "px");
				this.$.feedView.applyStyle("height", window.innerHeight - 55 + "px");					
			} else {
				this.$.feedView.applyStyle("height", window.innerHeight - 55 - 120 + "px");					
			}
		} else {
			this.$.feedView.applyStyle("height", window.innerHeight - 55 + "px");			
		}
		
		this.$.feedView.$.cardContainer.resizeHandler();	
		this.$.feedView.$.itemView.resized();	
	},

	flick: function(inSender, inEvent){
		if (Math.abs(inEvent.yVel) > Math.abs(inEvent.xVel)) {
			if (inEvent.yVel < 0) {
				//view the "all" feed
				this.viewFeed(this, reader.getFeeds()[0], this.$.feedIconList.$.grid.getControls()[0]);
			}
		}

	},
	translatePage: function(inPos, callback){
		this.$.second.hasNode();
		var elem = this.$.second.node;

		var transform = 'translate3d(0, ' + inPos + ', 0)';

		var trans = Morf.transition(elem, {
	        '-webkit-transform': transform,
	    }, {
	        duration: "350ms",
	        timingFunction: "ease-in-out",
	        callback: function (elem) {
				if (callback) {
					callback();
				}
			}
	    });
	},

	viewIcons: function(inSender){
		this.iconListShowing = true;

		this.$.feedIconList.$.grid.removeClass("enyo-hflexbox");
		this.$.feedIconList.$.grid.addClass("enyo-grid");
		this.translatePage("0px", enyo.bind(this, function(){
			this.$.feedIconList.loadFeeds();		
		}));
		//this.$.feedIconList.applyStyle("height", window.innerHeight - 55 + "px");
		
		this.$.feedIconList.$.scroller.setVertical(true);
		this.$.feedIconList.$.scroller.setAutoVertical(true);
		this.$.feedIconList.$.scroller.setScrollTop(0);
		this.$.feedIconList.$.scroller.setScrollLeft(0);
			
		this.$.feedView.$.itemView.hide();
		
		setTimeout(enyo.bind(this, function(){
			this.$.feedView.$.cardContainer.resized();
			//this.$.feedView.$.cardContainer.destroyControls();
		}), 1000);
			
		this.$.toolbar.setTitle("NomNomNom for Google Reader"); //@TODO: there will be a bug here if anyone names a feed this
	},
	viewSmallIcons: function(inSender){
		this.iconListShowing = true;

		this.$.feedIconList.$.grid.removeClass("enyo-grid");
		this.$.feedIconList.$.grid.addClass("enyo-hflexbox");

		this.translatePage(0 - window.innerHeight + 55 + 120 + "px", enyo.bind(this, function(){
			this.$.feedView.applyStyle("height", window.innerHeight - 55 - 120 + "px");
			this.$.feedIconList.loadFeeds();		
		}), "300ms");

		this.$.feedIconList.$.scroller.setVertical(false);
		this.$.feedIconList.$.scroller.setAutoVertical(false);
	},
	
	hideIcons: function(inSender){
		this.iconListShowing = false;
		this.translatePage(0 - window.innerHeight + 55 + "px");
		this.$.feedView.applyStyle("height", window.innerHeight - 55 + "px");

		//this.$.feedIconList.applyStyle("height", "0px");
		//this.iconListShowing = false;
	},
	viewFeed: function(inSender, inFeed, inFeedIcon){
		if(inFeedIcon){
			this.inFeedIcon = inFeedIcon;
			this.inFeedIcon.startSpinning();	
		} else {
			this.inFeedIcon = undefined;
		}
		
	    this.$.feedView.loadFeed(inFeed);	
	},
	feedLoaded: function(inSender, hasItems){
		if(this.inFeedIcon){
			this.inFeedIcon.stopSpinning();		
		}
		
		if(hasItems){
			_.defer(enyo.bind(this, function(){
				//this.$.feedView.setShowing(true);	
				//this.$.feedView.applyStyle("height", window.innerHeight - 55 + "px");	

				this.hideIcons();
					
				setTimeout(enyo.bind(this, function(){
					//this.$.feedView.applyStyle("height", null);	
				}), 500);
				
			    this.$.toolbar.setTitle(inSender.getFeed().title);	

			}));
		} else {

		}	
	},
	reclaimSpace: function(){
		publish("article/view", [false]);

		this.$.feedView.$.itemView.$.imageViewPopup.close();
		//this.$.feedView.$.cardContainer.$.snapScroller.snapTo(this.$.feedView.$.cardContainer.$.snapScroller.getIndex());
	},
	connectionResponseHandler: function(inSender, inResponse){
		 if (inResponse.isInternetConnectionAvailable === true || !window.PalmSystem) {
		 	reader.hasInternet = true;
		 } else {
		 	reader.hasInternet = false;
		 }
	}
});