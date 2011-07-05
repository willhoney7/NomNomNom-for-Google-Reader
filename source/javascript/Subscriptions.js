enyo.kind({
	name: "Subscriptions", 
	kind: enyo.SlidingView, 
	width: "320px", 
	events: {
		onFeedClick: ""	
	},
	components: [
		{kind: "Header", content: "Google Reader"},
		{kind: "Scroller", flex: 1, autoHorizontal: false, horizontal: false, components: [
			{name: "login", kind: enyo.VFlexBox, style: "margin: 0px 5px", showing: false, components: [
				{kind: enyo.RowGroup, caption: "Log in to Google Reader", components: [
					{name: "emailAddress", kind: enyo.Input, hint: "Gmail Address", alwaysLooksFocused: false},
					{name: "password", kind: enyo.PasswordInput, hint: "Password", alwaysLooksFocused: false},
					{kind: enyo.Button, content: "Log in", onclick: "login"}
				]},
				{name: "errorResponse", className: "errorText"}
			]},
			{name: "subscriptionList", kind: enyo.VirtualRepeater, onSetupRow: "setupRow", components: [
				{kind: "Item", className: "outerItem", tapHighlight: true, onclick: "doFeedClick", layoutKind: "VFlexLayout", components: [
					{kind: enyo.HFlexBox, style: "padding: 10px;", components: [
						{name: "folderImage", onclick: "toggleDrawer", kind: "Image", src:'images/small_folder.png', style:'margin-right: 10px;', showing: false},
		            	{name: "caption", allowHtml: true, flex: 1},
					]}
					
		        ]}
			]}
			
		]}
	],
	feeds: [],

	create: function(){ 
		this.inherited(arguments);

		//load the reader, which returns whether the user is logged in.
		this.$.login.setShowing(!reader.load());

		if(reader.is_logged_in === true){
			this.loginSuccess();
		}
		//show the login block if the user isn't logged in.
	},

	login: function(){
		var emailAddress = this.$.emailAddress.getValue(),
			password = this.$.password.getValue();
		
			reader.login(emailAddress, password, enyo.bind(this, this.loginSuccess), enyo.bind(this, this.reportError));
	},
	loginSuccess: function(){
		this.getToken();
	},
	reportError: function(error){
		this.$.errorResponse.setContent("Error: " + error);
	},
	getToken: function(){
		reader.getToken(enyo.bind(this, this.getSubscriptions), enyo.bind(this, this.reportError));	
	},


	getSubscriptions: function(){
		reader.getSubscriptions(enyo.bind(this, function(subscriptions){
			this.feeds = AppUtils.processSubscriptions(subscriptions);
			this.$.subscriptionList.render();

			this.$.login.hide();
		}));
	},
	setupRow: function(inSender, inIndex) {
    	if (this.feeds[inIndex]) {
	    	this.$.item.feed = this.feeds[inIndex].feeds;
    		if(this.feeds[inIndex].feeds){
	    	    this.$.caption.setContent(this.feeds[inIndex].label);
	    	    this.$.folderImage.setShowing(true);
	    	    this.$.item.createComponent({
	    	    	kind: enyo.BasicDrawer,
	    	    	open: false,
	    	    	components: [
	    	    		{kind: "VFlexBox", width: "100%", components: [
	    	    			{kind: enyo.VirtualRepeater, onSetupRow: "setupFolderRow", components: [
		    	    			{kind: "Item", owner: this, onclick: "doFeedClick", layoutKind: "HFlexLayout", components: [
						            {allowHtml: true, width: "320px", flex: 1},
						        ]}
			    	    	]}
			    	    ]}
	    	    	]
	    	    }, {owner: this})	
	    	    this.$.item.render();		    			
    		} else {
	    	    this.$.caption.setContent(this.feeds[inIndex].title);			
	    	    this.$.folderImage.setShowing(false);			    			
    		}
    	    return true;
   		}
	},
	setupFolderRow: function(inSender, inIndex){
		var array;
		try {
			array = inSender.parent.parent.parent.parent.feed || []; //@TODO: this is a terrible thing to do. Need to fix.		
		} catch(e){
			array = [];
		}
		if (array[inIndex]){
			this.$.control.setContent(array[inIndex].title);
			return true;
		}  
	},
	toggleDrawer: function(inSender, inIndex){
		if(!this.$.basicDrawer.getOpen() === true){
			this.$.folderImage.setSrc("images/small_folder_open.png");			
		} else {
			this.$.folderImage.setSrc("images/small_folder.png");
		}
		this.$.basicDrawer.setOpen(!this.$.basicDrawer.getOpen());

		return true;
	}
});