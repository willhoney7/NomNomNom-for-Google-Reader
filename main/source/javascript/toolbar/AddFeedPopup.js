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
		{layoutKind: "HFlexLayout", style: "position: relative", components: [
			{content: "Add Feed"},
			{kind: "Spacer"},
			{kind: "ToolButton", icon: "source/images/menu-icon-close.png", style: "position: absolute; bottom: -10px; right: -10px", onclick: "close"}
		]},	
		{kind: enyo.RowGroup, components: [
			{kind: enyo.ListSelector, value: "either", items: [
		        {caption: "Auto-Detect", value: "either"},
		        {caption: "URL", value: "url"},
		        {caption: "Keyword", value: "keyword"},
		    ]},
		    {name: "input", kind: enyo.Input, hint: "", autoCapitalize: "lowercase", alwaysLooksFocused: true},
		]},
		{kind: enyo.ActivityButton, content: "Go", onclick: "go"},
		{kind: enyo.Group, caption: "Results", showing: false, components: [
			{kind: enyo.Scroller, height: "250px", horizontal: false, autoHorizontal: false, components: [
				{kind: enyo.VirtualRepeater, onSetupRow: "setupRow", components: [
					{kind: enyo.Item, tapHighlight: true, onclick: "itemClick", components: [
						{name: "title", className: "truncating-text", style: "font-weight: bold", allowHtml: true},
						{name: "link", className: "truncating-text", style: "font-size: 15px", allowHtml: true},
						{name: "content", className: "truncating-text", style: "font-size: 13px", allowHtml: true}
					]}
				]}
			]}
		]},
		{name: "errorResponse", className: "errorText"}
		
	],
	close: function(){
		this.inherited(arguments);

		enyo.keyboard.setManualMode(false); // closes the keyboard
		
		if(this.$.group) {
			this.$.group.hide();			
		}

	},
	showAtCenter: function(){
		if(this.lazy) {
			this.validateComponents();
		}

		this.$.input.setValue("");
		this.$.listSelector.setValue("either");
		
		this.openAtTopCenter();
		
		enyo.keyboard.forceShow(7);
		this.$.input.forceFocus();

	},

	go: function(){
		if(!this.$.input.isEmpty()){
			reader.processFeedInput(this.$.input.getValue(), this.$.listSelector.getValue(), enyo.bind(this, function(response, type){
				this.$.activityButton.setActive(false);

				if(type === "keyword"){
					if(response.length === 0){
						this.$.errorResponse.setContent("No Results.");
					} else {
						this.items = response;
						//console.log(this.items);
						this.$.group.show();
						this.$.virtualRepeater.render();
					}
				} else {
					reader.subscribeFeed(response.feedUrl, enyo.bind(this, function(arg){
						//@TODO: when already added, it just returns a "OK"
						this.close();
						publish("icons", ["refresh"]);

					}), response.title);
				}
			}), enyo.bind(this, this.reportError));

			this.$.errorResponse.setContent("");
			this.$.activityButton.setActive(true);		
		}

		
		
	},

	setupRow: function(inSender, inIndex){
		if(this.items && this.items[inIndex]){
			this.$.title.setContent(this.items[inIndex].title);
			this.$.link.setContent(this.items[inIndex].link);
			this.$.content.setContent(this.items[inIndex].contentSnippet.replace("<br>", ""));
			return true;
		}	
	},

	itemClick: function(inSender, inEvent){
		reader.subscribeFeed(this.items[inEvent.rowIndex].url, enyo.bind(this, function(arg){
			this.close();
			publish("icons", ["refresh"]);
		}), htmlToText(this.items[inEvent.rowIndex].title));
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
