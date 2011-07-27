enyo.kind({
	name: "LoginPopup",
	kind: "gReader.Popup",
	scrim: true,
	modal: true,
	autoClose: false,
	dismissWithClick: false,

	width: "400px",
	showKeyboardWhenOpening:false, // opens the keyboard and positions the popup correctly
	events: {
		onLoginSuccess: ""	
	},
	components: [
		{layoutKind: "HFlexLayout", components: [
			{content: "Login"},
			{kind: "Spacer"},
			//{kind: "ToolButton", icon: "source/images/icon-close.png", style: "position: relative; bottom: 7px;", onclick: "doClose"}
		]},	
		{kind: enyo.RowGroup, components: [
			{name: "emailAddress", kind: enyo.Input, hint: "Gmail Address", alwaysLooksFocused: false},
			{name: "password", kind: enyo.PasswordInput, hint: "Password", alwaysLooksFocused: false},
		]},
		{kind: enyo.ActivityButton, content: "Log in", onclick: "login"},
		{name: "errorResponse", className: "errorText"}
		
	],
	close: function(){
		this.inherited(arguments);
		enyo.keyboard.setManualMode(false); // closes the keyboard
	},
	showAtCenter: function(){
		if(this.lazy) {
			this.validateComponents();
		}
		
		this.openAtTopCenter();
		this.$.emailAddress.forceFocus();
		enyo.keyboard.forceShow(4);

	},

	login: function(){
		var emailAddress = this.$.emailAddress.getValue(),
			password = this.$.password.getValue();

		this.$.errorResponse.setContent("");
		this.$.activityButton.setActive(true);
		reader.login(emailAddress, password, enyo.bind(this, this.loginSuccess), enyo.bind(this, this.reportError));
	},
	loginSuccess: function(){
		this.$.activityButton.setActive(false);
		this.doLoginSuccess();
		
		this.close();
		
	},

	reportError: function(error){
		this.$.activityButton.setActive(false);

		this.$.errorResponse.setContent("Error: " + error);
	},
	
	/*searchBoxKeydown: function(inSender, inEvent) {
		if (inEvent.keyCode === 13) {
			this.search();
			inEvent.preventDefault();	
		}
	},*/

});
