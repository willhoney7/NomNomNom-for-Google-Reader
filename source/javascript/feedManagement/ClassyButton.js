enyo.kind({
	name: "ClassyButton",
	kind: enyo.Control,
	className: "classyButton",
	published: {
		color: "green", // or "orange"	
		title: ""
	},
	components: [
		{kind: enyo.Control, className: "classyButton", onmousedown: "mousedown", onmouseup: "mouseup", onmouseout: "mouseup"}
	],
	create: function(){
		this.inherited(arguments);
		this.colorChanged();
		this.titleChanged();
	},
	colorChanged: function(){
		this.$.control.setClassName("classyButton " + this.color);
	},
	titleChanged: function(){
		this.$.control.setContent(this.title);
	},
	mousedown: function(){
		this.$.control.addClass("depressed");
	}, 
	mouseup: function(){
		this.$.control.removeClass("depressed");
	}

})