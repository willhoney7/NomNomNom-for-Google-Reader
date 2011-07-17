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
		{kind: enyo.HFlexBox, components: [
			{content: "Rename"},
			{kind: "Spacer"},
			{kind: "ToolButton", icon: "source/images/menu-icon-close.png", style: "position: relative; bottom: 10px;", onclick: "close"}
		]},	
		{name: "name", kind: enyo.Input, hint: "Feed Name", selectAllOnFocus: true, alwaysLooksFocused: true},
		{kind: enyo.ActivityButton, content: "Rename", onclick: "rename"},
		{name: "errorResponse", className: "errorText"}
		
	],
	close: function(){
		this.inherited(arguments);
		enyo.keyboard.setManualMode(false); // closes the keyboard
		AppUtils.refreshIcons();
	},
	showAtCenter: function(feed){
		if(this.lazy) {
			this.validateComponents();
		}
		this.feed = feed;
		this.$.name.setValue(this.feed.title);

		this.openAtTopCenter();
		
		enyo.keyboard.forceShow(4);

		this.$.name.forceFocus();

	},

	rename: function(){
		if(this.$.name.isEmpty() || this.$.name.getValue() === this.feed.title){
			this.close();
		} else {
			if(this.feed.isFeed){
				reader.editFeedTitle(this.feed.id, this.$.name.getValue(), enyo.bind(this, this.close));			
			} else if(this.feed.isLabel){
				reader.editLabelTitle(this.feed.label, this.$.name.getValue(), enyo.bind(this, this.close));
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
