enyo.kind({
	name: "AboutPopup",
	kind: enyo.Popup,
	scrim: true,
	modal: true,
	autoClose: true,
	dismissWithClick: true,
	width: "400px",
	events: {
	
	},
	components: [
		{layoutKind: "HFlexLayout", style: "position: relative", components: [
			{content: "About NomNomNom" + ' v' + enyo.fetchAppInfo().version},
			{kind: "Spacer"},
			{kind: "ToolButton", icon: "source/images/menu-icon-close.png", style: "position: absolute; bottom: -10px; right: -10px", onclick: "close"}
		]},	
		{kind: enyo.VFlexBox, autoVertical: false, components: [
			{kind: enyo.Spacer},
			{kind: "HtmlContent", name:"aboutContent", style: "font-size: 14px", srcId: "aboutContent"},
			{kind: enyo.Spacer}
		]}		
	],
	close: function(){
		this.inherited(arguments);
	},
	showAtCenter: function(){
		if(this.lazy) {
			this.validateComponents();
		}		
		this.openAtCenter();
	}

});
