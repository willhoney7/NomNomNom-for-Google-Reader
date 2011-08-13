enyo.kind({
	name: "ClassyButton",
	kind: enyo.Control,
	className: "classyButton",
	published: {
		color: "green", // or "orange"	
		title: "",
		active: false,
		large: false
	},
	components: [
		{kind: enyo.HFlexBox, className: "classyButton", onmousedown: "mousedown", onmouseup: "mouseup", onmouseout: "mouseup", components:[
			{name: "content", flex: 1},
			{kind: enyo.Spinner, showing: false}

		]}
	],
	create: function(){
		this.inherited(arguments);
		this.colorChanged();
		this.titleChanged();
		this.activeChanged();
		this.largeChanged();
	},
	colorChanged: function(){
		this.$.hFlexBox.setClassName("classyButton " + this.color);
	},
	titleChanged: function(){
		this.$.content.setContent(this.title);
	},
	activeChanged: function(){
		this.$.spinner.setShowing(this.active);
	},
	largeChanged: function(){
		this.$.hFlexBox.addRemoveClass("large", this.large);	
	},
	mousedown: function(){
		this.$.hFlexBox.addClass("depressed");
	}, 
	mouseup: function(){
		this.$.hFlexBox.removeClass("depressed");
	}

})