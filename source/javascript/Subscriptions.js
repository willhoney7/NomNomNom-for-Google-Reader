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
				{kind: "OuterFeedItem", onFeedClick: "doFeedClick"}
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
    		this.$.outerFeedItem.setFeed(this.feeds[inIndex]);
    	    return true;
   		}
	}
});