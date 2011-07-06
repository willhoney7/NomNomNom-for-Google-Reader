enyo.kind({
	name: "ItemView", 
	kind: enyo.SlidingView, 
	flex: 1,
	published: {
		item: ""	
	},
	components: [
		{kind: "Header", content: ""},
		{kind: enyo.Scroller, horizontal: false, flex: 1, autoHorizontal: false, components: [
			{name: "itemContent", allowHtml: true, className: "itemContent"}
		]},
		{kind: "Toolbar", components: [
			{kind: "GrabButton"}
		]}
	],
	create: function(){
		this.inherited(arguments);	
	},
	itemChanged: function(inOldValue){
		this.$.scroller.setScrollTop(0);
		this.$.header.setContent(this.getItem().label || this.getItem().title);
		
		var content = (this.getItem().summary) ? this.getItem().summary.content || "": (this.getItem().content) ? this.getItem().content.content || "": "";
		this.$.itemContent.setContent(content + "<br/>");
	},

});