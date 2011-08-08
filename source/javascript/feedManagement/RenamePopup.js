enyo.kind({
	name: "RenamePopup",
	kind: "gReader.Popup",
	scrim: true,
	modal: true,
	autoClose: false,
	dismissWithClick: false,

	width: "400px",
	showKeyboardWhenOpening:false, // opens the keyboard and positions the popup correctly
	components: [
		{layoutKind: "HFlexLayout", style: "position: relative;", components: [
			{name: "title", content: "Rename"},
			{kind: "Spacer"},
			{kind: "ToolButton", icon: "source/images/menu-icon-close.png", style: "position: absolute; bottom: -10px; right: -10px", onclick: "close"}
		]},	
		{name: "name", kind: enyo.Input, hint: "Feed Name", style: "margin-top: 5px;", selectAllOnFocus: true, alwaysLooksFocused: true},
		{name: "button", kind: enyo.ActivityButton, caption: "Rename", onclick: "finish"},
		{name: "errorResponse", className: "errorText"}
		
	],
	closeAndRefresh: function(){
		this.close();
		AppUtils.refreshIcons();
	},
	close: function(){
		this.inherited(arguments);
		enyo.keyboard.setManualMode(false); // closes the keyboard		
	},
	showAtCenter: function(feed, opt){
		if(this.lazy) {
			this.validateComponents();
		}
		this.opt = opt;
		if(opt === "new label"){
			this.$.title.setContent("New Label");
			this.$.button.setCaption("Add New Label");
			this.$.name.setValue("");
		} else {
			this.$.title.setContent("Rename");
			this.$.button.setCaption("Rename");
			this.$.name.setValue(feed.title);		
		}

		this.feed = feed;
		
		this.openAtTopCenter();
		
		enyo.keyboard.forceShow(4);
		this.$.name.forceFocus();

	},

	finish: function(){
		if(this.$.name.isEmpty() || this.$.name.getValue() === this.feed.title){
			this.close();
		} else {
			if(this.opt === "new label"){
				reader.editFeedLabel(this.feed.id, "user/-/label/" + this.$.name.getValue(), true, enyo.bind(this, this.close));				
			} else {
				if(this.feed.isFeed){
					reader.editFeedTitle(this.feed.id, this.$.name.getValue(), enyo.bind(this, this.closeAndRefresh));			
				} else if(this.feed.isLabel){
					reader.editLabelTitle(this.feed.label, this.$.name.getValue(), enyo.bind(this, this.closeAndRefresh));
				}	
			} 
			
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
