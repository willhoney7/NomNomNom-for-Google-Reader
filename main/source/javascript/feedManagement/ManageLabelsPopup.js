enyo.kind({
	name: "ManageLabelsPopup",
	kind: "gReader.Popup",
	layoutKind: "VFlexLayout",
	scrim: true,
	modal: true,
	autoClose: false,
	dismissWithClick: true,
	height: "350px",
	width: "400px",
	showKeyboardWhenOpening:false, // opens the keyboard and positions the popup correctly

	components: [
		{kind: enyo.VFlexBox, flex: 1, components: [
			{layoutKind: "HFlexLayout", style: "position: relative", components: [
				{content: "Manage Tags"},
				{kind: "Spacer"},
				{kind: "ToolButton", icon: "source/images/menu-icon-close.png", style: "position: absolute; bottom: -10px; right: -10px", onclick: "close"}
			]},	
			{kind: enyo.RowGroup, height: "200px", caption: "tags", components: [
				{kind: enyo.Scroller, height: "200px", horizontal: false, autoHorizontal: false, components: [
					
				]},
			]},
			{name: "errorResponse", className: "errorText"}
		]}		
	],
	close: function(){
		this.inherited(arguments);
		enyo.keyboard.setManualMode(false); // closes the keyboard
		publish("icons", ["refresh"]);
	},
	showAtCenter: function(feed){
		if(this.lazy) {
			this.validateComponents();
		}
		this.feed = feed;
		var components = [];
		_.each(this.feed.categories, function(category){
			components.push({kind: enyo.SwipeableItem, layoutKind: "HFlexLayout", onConfirm: "removeLabel", components: [
				{flex: 1, kind: enyo.Input, hint: "label", value: category.label, alwaysLooksFocused: false},
				{kind: enyo.CheckBox, checked: true}
			]});
		});
		components.push({kind: enyo.SwipeableItem, layoutKind: "HFlexLayout", onConfirm: "removeLabel", components: [
			{flex: 1, kind: enyo.Input, hint: "label", value: "", alwaysLooksFocused: false},
			{kind: enyo.CheckBox, checked: false}
		]});
		this.$.scroller.createComponents(components, {owner: this});
		this.$.scroller.render();
		//this.$.virtualRepeater.render();

		this.openAtTopCenter();
		
		//enyo.keyboard.forceShow(4);

	},
	setupRow: function(inSender, inIndex){
		if(this.feed.categories[inIndex]){
			this.$.labelTitle.setContent(this.feed.categories[inIndex].label);
			return true;
		}
	},

	/*searchBoxKeydown: function(inSender, inEvent) {
		if (inEvent.keyCode === 13) {
			this.search();
			inEvent.preventDefault();	
		}
	},*/

});
