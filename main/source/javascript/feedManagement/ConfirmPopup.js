enyo.kind({
	name: "ConfirmPopup",
	kind: enyo.Popup,
	components: [
		{kind: enyo.HFlexBox, components: [
			{name: "title", flex: 1, content: ""},
		]},
		{kind: enyo.HFlexBox, components: [
			{kind: enyo.Button, className: "enyo-button-affirmative", flex: 1, caption: "Yes", onclick: "run"},
			{kind: enyo.Button, flex: 1, caption: "Cancel", onclick: "close"}
		]}
	],
	showAtEvent: function(event, arg){
		if(this.lazy) {
			this.validateComponents();
		}
		this.$.title.setContent(arg.title || "Are you sure?");
		this.arg = arg;

		this.openAtEvent(event);
	},
	run: function(){
		this.arg.doIt(this);
		this.close();
	}
	
});
