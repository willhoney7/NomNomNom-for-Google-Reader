enyo.kind({
	name: "AddFeedPopup",
	kind: "gReader.Popup",
	scrim: true,
	modal: true,
	autoClose: true,
	dismissWithClick: true,

	width: "400px",
	showKeyboardWhenOpening:false, // opens the keyboard and positions the popup correctly
	events: {
		onLoginSuccess: ""	
	},
	components: [
		{layoutKind: "HFlexLayout", components: [
			{content: "Add Feed"},
			{kind: "Spacer"},
			{kind: "ToolButton", icon: "source/images/menu-icon-close.png", style: "position: relative; bottom: 10px; left: 10px", onclick: "close"}
		]},	
		{kind: enyo.RowGroup, components: [
			{kind: enyo.ListSelector, value: "either", items: [
		        {caption: "URL or Keyword", value: "either"},
		        {caption: "URL", value: "url"},
		        {caption: "Keyword", value: "keyword"},
		    ]},
		    {name: "input", kind: enyo.Input, hint: "", alwaysLooksFocused: true},
			
		]},
		{kind: enyo.ActivityButton, content: "Go", onclick: "go"},
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

		this.$.input.setValue("");
		this.$.listSelector.setValue("either");
		
		this.openAtTopCenter();
		
		enyo.keyboard.forceShow(7);

	},

	go: function(){
		if(!this.$.input.isEmpty()){
			reader.processFeedInput(this.$.input.getValue(), this.$.listSelector.getValue(), enyo.bind(this, function(response, type){
				this.$.activityButton.setActive(false);

				if(type === "keyword"){
					if(response.length === 0){
						this.$.errorResponse.setContent("No Results");
					} else {
						console.log("@TODO: do stuff with results", response);
					}
				} else {
					reader.subscribeFeed(response.feedUrl, enyo.bind(this, function(arg){
						//@TODO: when already added, it just returns a "OK"
						this.close();
						AppUtils.refreshIcons();
					}), response.title);
				}
			}), enyo.bind(this, this.reportError));

			this.$.errorResponse.setContent("");
			this.$.activityButton.setActive(true);		
		}

		
		
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
