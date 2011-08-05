enyo.kind({
	name: "ekl.Popup.PopupSelect",
	kind: enyo.PopupSelect,
	events: {
		onClose: ""
	},
	close: function(){
		this.inherited(arguments);
		this.doClose();
	}
});